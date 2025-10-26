// test/it/order/order-payment-flow.it.spec.ts
import { createItModuleMySql } from "../setup.mysql";
import { DataSource, Repository } from "typeorm";
import { getRepositoryToken } from "@nestjs/typeorm";

import { AuthService } from "../../../src/auth/auth.service";
import { UserService } from "../../../src/user/user.service";
import { OrderService } from "../../../src/order/usecase/order.service";

import { UserEntity } from "../../../src/user/entities/user.entity";
import { ProductEntity } from "../../../src/product/entities/product.entity";
import { OrderEntity } from "../../../src/order/adapter/out/order.entity";
import { OutboxEntity } from "../../../src/order/adapter/out/outbox.entity";

describe("잔액 차감 동시성 제어 - 전체 통합 (Integration)", () => {
  let ds: DataSource;

  let authSvc: AuthService;
  let userSvc: UserService;
  let orderSvc: OrderService;

  let userRepo: Repository<UserEntity>;
  let productRepo: Repository<ProductEntity>;
  let orderRepo: Repository<OrderEntity>;
  let outboxRepo: Repository<OutboxEntity>;

  let userIds: number[];
  let productId_A: number;
  let productId_B: number;

  beforeAll(async () => {
    const { moduleRef, dataSource } = await createItModuleMySql();
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

    // [Given] 유저 10명 생성
    const users = await Promise.all(
      Array.from({ length: 10 }, (_, i) => authSvc.signUp(`사용자${i + 1}`))
    );
    userIds = users.map((u) => u.userId);
  });

  it("성공 시나리오: 동일 유저가 동시에 두 번 결제해도 잔액은 한 번만 차감되어야 한다", async () => {
    // [Given] 한 명의 참여 유저에게 5,000원 충전
    await userSvc.chargeBalance(5000, userIds[0]);

    // [Given] A 상품 ( 재고 10개 )
    await productRepo.save(
      productRepo.create({
        name: "A 상품",
        price: 3000,
        stock: 10,
      })
    );
    productId_A = (await productRepo.findOneByOrFail({ name: "A 상품" }))
      .productId;

    // [When] A 상품을 동시에 두 번 주문 시도
    const results = await Promise.allSettled([
      orderSvc.execute({
        userId: userIds[0],
        items: [{ productId: productId_A, quantity: 1 }],
      }),
      orderSvc.execute({
        userId: userIds[0],
        items: [{ productId: productId_A, quantity: 1 }],
      }),
    ]);

    // [Then] 성공/실패 판별
    const fulfilledCount = results.filter(
      (r) => r.status === "fulfilled"
    ).length;
    const rejectedCount = results.filter((r) => r.status === "rejected").length;
    expect(fulfilledCount).toBe(1);
    expect(rejectedCount).toBe(1);

    // [Then] 잔액 검증 (성공한 유저만 돈 빠졌는지)
    const uA = await userRepo.findOneByOrFail({ userId: userIds[0] });
    expect(uA.balance).toBe(2000);

    // [Then] 음수 잔액 방지
    expect(uA.balance).toBeGreaterThanOrEqual(0);

    // [Then] 주문이 실제로 최소 1건이 생겼는지
    const allOrders = await orderRepo.find({
      where: {}, // 전부
    });
    expect(allOrders.length).toBe(1);
    expect(allOrders[0].status).toBe("PAID");
    expect(allOrders[0].paidAmount).toBe(3000);
    expect(allOrders[0].user.userId).toBe(userIds[0]);
  });
  it("성공 시나리오: 같은 유저가 동시에 두 주문을 넣어도, 보유 잔액(5000원)보다 많이 쓸 수는 없어야 한다", async () => {
    // [Given] 한 명의 참여 유저에게 5,000원 충전
    await userSvc.chargeBalance(5000, userIds[0]);

    // [Given] A 상품 ( 재고 10개 )
    await productRepo.save(
      productRepo.create({
        name: "A 상품",
        price: 3000,
        stock: 10,
      })
    );
    productId_A = (await productRepo.findOneByOrFail({ name: "A 상품" }))
      .productId;
    // [Given] B 상품 ( 재고 10개 )
    await productRepo.save(
      productRepo.create({
        name: "B 상품",
        price: 3000,
        stock: 10,
      })
    );
    productId_B = (await productRepo.findOneByOrFail({ name: "B 상품" }))
      .productId;

    // [When] A와 B 상품을 동시에 주문 시도
    const results = await Promise.allSettled([
      orderSvc.execute({
        userId: userIds[0],
        items: [{ productId: productId_A, quantity: 1 }],
      }),
      orderSvc.execute({
        userId: userIds[0],
        items: [{ productId: productId_B, quantity: 1 }],
      }),
    ]);

    // [Then] 성공/실패 판별
    const fulfilledCount = results.filter(
      (r) => r.status === "fulfilled"
    ).length;
    const rejectedCount = results.filter((r) => r.status === "rejected").length;
    expect(fulfilledCount).toBe(1);
    expect(rejectedCount).toBe(1);

    // [Then] 잔액 검증 (성공한 유저만 돈 빠졌는지)
    const uA = await userRepo.findOneByOrFail({ userId: userIds[0] });
    expect(uA.balance).toBe(2000);

    // [Then] 음수 잔액 방지
    expect(uA.balance).toBeGreaterThanOrEqual(0);

    // [Then] 주문이 실제로 최소 1건이 생겼는지
    const allOrders = await orderRepo.find({
      where: {}, // 전부
    });
    expect(allOrders.length).toBe(1);
    expect(allOrders[0].status).toBe("PAID");
    expect(allOrders[0].paidAmount).toBe(3000);
    expect(allOrders[0].user.userId).toBe(userIds[0]);
  });
  it("트랜잭션 도중 실패하면 잔액 차감도 롤백되어야 한다", async () => {
    // [Given] 유저 한 명 (잔액 부족 상태)
    await userSvc.chargeBalance(1000, userIds[0]);

    // [Given] A 상품 ( 재고 10개 )
    await productRepo.save(
      productRepo.create({
        name: "A 상품",
        price: 3000,
        stock: 10,
      })
    );
    productId_A = (await productRepo.findOneByOrFail({ name: "A 상품" }))
      .productId;

    // [When/Then] 주문 시도 → 실패해야 함
    await expect(
      orderSvc.execute({
        userId: userIds[0],
        items: [{ productId: productId_A, quantity: 1 }],
      })
    ).rejects.toBeDefined();

    // [Then] 잔액 롤백 확인: 여전히 1000이어야 한다
    const userAfter = await userRepo.findOneByOrFail({ userId: userIds[0] });
    expect(userAfter.balance).toBe(1000);

    // [Then] 주문이 실제로 만들어지지 않았는지 확인 (DB에 없는지)
    const orders = await orderRepo.find();
    expect(orders.length).toBe(0);

    // [Then] outbox에도 이벤트가 남으면 안 된다
    const outboxRecords = await outboxRepo.find();
    expect(outboxRecords.length).toBe(0);
  });
});
