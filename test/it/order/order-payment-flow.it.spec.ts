// test/it/order/order-payment-flow.it.spec.ts
import { createItModule } from "../setup";
import { DataSource, Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

import { AuthService } from "../../../src/auth/auth.service";
import { UserService } from "../../../src/user/user.service";
import { OrderService } from "../../../src/order/usecase/order.service";

import { UserEntity } from "../../../src/user/entities/user.entity";
import { ProductEntity } from "../../../src/product/entities/product.entity";
import { OrderEntity } from "../../../src/order/adapter/out/order.entity";
import { OutboxEntity } from "../../../src/order/adapter/out/outbox.entity";

describe("상품 주문 & 결제 - 전체 통합 (Integration)", () => {
  let ds: DataSource;

  let authSvc: AuthService;
  let userSvc: UserService;
  let orderSvc: OrderService;

  let userRepo: Repository<UserEntity>;
  let productRepo: Repository<ProductEntity>;
  let orderRepo: Repository<OrderEntity>;
  let outboxRepo: Repository<OutboxEntity>;

  let userId: number;
  let productId: number;

  beforeAll(async () => {
    const { moduleRef, dataSource } = await createItModule();
    ds = dataSource;

    authSvc = moduleRef.get(AuthService);
    userSvc = moduleRef.get(UserService);
    orderSvc = moduleRef.get(OrderService);

    // 서비스와 **동일 커넥션**의 리포지토리 사용
    userRepo = moduleRef.get(getRepositoryToken(UserEntity));
    productRepo = moduleRef.get(getRepositoryToken(ProductEntity));
    orderRepo = moduleRef.get(getRepositoryToken(OrderEntity));
    outboxRepo = moduleRef.get(getRepositoryToken(OutboxEntity));
  });

  beforeEach(async () => {
    // 매 테스트 독립성 보장
    await ds.synchronize(true);

    // [Given] 회원가입으로 사용자 생성
    const user = await authSvc.signUp("김민수");
    userId = user.userId;

    // [Given] 상품(재고 10, 가격 3,000원) 생성
    const p = await productRepo.save(
      productRepo.create({ name: "샘플상품", price: 3000, stock: 10 })
    );
    productId = p.productId;
  });

  it("성공 시나리오: 주문 완료 → 잔액/재고 감소 + 주문PAID + outbox 기록", async () => {
    // [Given] 잔액 5,000원 충전
    await userSvc.chargeBalance(5000, userId);

    // [When] 3,000원짜리 상품 1개 주문
    const res = await orderSvc.execute({
      userId,
      items: [{ productId, quantity: 1 }],
    });

    // [Then] 잔액 2,000원으로 감소
    const u = await userRepo.findOneByOrFail({ userId });
    expect(u.balance).toBe(2000);

    // [Then] 재고 1 감소 (10 → 9)
    const p = await productRepo.findOneByOrFail({ productId });
    expect(p.stock).toBe(9);

    // [Then] 주문이 저장되고 상태가 PAID
    const order = await orderRepo.findOneByOrFail({ orderId: res.orderId });
    expect(order.status).toBe("PAID"); // enum이면 문자열/enum 값에 맞춰 확인

    // [Then] 아웃박스에 order.created 이벤트가 1건 적재
    const outbox = await outboxRepo.find({
      where: { topic: "order.created" },
    });

    expect(outbox.length).toBe(1);
    expect(outbox[0].payload).toMatchObject({
      orderId: res.orderId,
      userId,
      totalAmount: 3000,
      status: "PAID",
      items: [{ productId, quantity: 1, unitPrice: 3000 }],
    });
  });

  it("실패 시나리오: 잔액 부족 → 주문 실패하고 잔액/재고 모두 롤백", async () => {
    // [Given] 잔액 2,000원만 충전 (가격 3,000원 < 부족)
    await userSvc.chargeBalance(2000, userId);

    // [When/Then] 주문 시도 시 에러 발생
    await expect(
      orderSvc.execute({
        userId,
        items: [{ productId, quantity: 1 }],
      })
    ).rejects.toBeDefined();

    // [Then] 잔액은 그대로 2,000원 (차감되지 않음)
    const u = await userRepo.findOneByOrFail({ userId });
    expect(u.balance).toBe(2000);

    // [Then] 재고도 그대로 10 (차감되지 않음)
    const p = await productRepo.findOneByOrFail({ productId });
    expect(p.stock).toBe(10);

    // [Then] 주문/아웃박스 어떤 것도 생성되지 않음
    const orders = await orderRepo.find();
    expect(orders.length).toBe(0);
    const outbox = await outboxRepo.find();
    expect(outbox.length).toBe(0);
  });
});
