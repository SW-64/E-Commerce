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
import { TestingModule } from "@nestjs/testing";

describe("재고 감소 동시성 제어 - 전체 통합 (Integration)", () => {
  let ds: DataSource;
  let moduleRef: TestingModule;
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
    const setup = await createItModuleMySql();
    moduleRef = setup.moduleRef;
    ds = setup.dataSource;

    authSvc = moduleRef.get(AuthService);
    userSvc = moduleRef.get(UserService);
    orderSvc = moduleRef.get(OrderService);

    // 서비스와 **동일 커넥션**의 리포지토리 사용
    userRepo = moduleRef.get(getRepositoryToken(UserEntity));
    productRepo = moduleRef.get(getRepositoryToken(ProductEntity));
    orderRepo = moduleRef.get(getRepositoryToken(OrderEntity));
    outboxRepo = moduleRef.get(getRepositoryToken(OutboxEntity));
  });
  afterAll(async () => {
    if (ds?.isInitialized) {
      await ds.destroy(); // DB 커넥션 풀 닫기
    }
    await moduleRef.close(); // Nest 컨테이너 / 내부 타이머 종료
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

  it("성공 시나리오: 재고가 1개 남은 상태에서 2명이 주문하면 한명만 성공하고 재고는 0이 된다", async () => {
    // [Given] 두 참여 유저에게 5,000원씩 충전
    await userSvc.chargeBalance(5000, userIds[0]);
    await userSvc.chargeBalance(5000, userIds[1]);

    // [Given] A 상품 ( 재고 1개 )
    await productRepo.save(
      productRepo.create({
        name: "A 상품",
        price: 3000,
        stock: 1,
      })
    );
    productId_A = (await productRepo.findOneByOrFail({ name: "A 상품" }))
      .productId;

    // [When] A 상품을 동시에 주문 시도 (동일 상품, 수량 1)
    const [r1, r2] = await Promise.allSettled([
      orderSvc.execute({
        userId: userIds[0],
        items: [{ productId: productId_A, quantity: 1 }],
      }),
      orderSvc.execute({
        userId: userIds[1],
        items: [{ productId: productId_A, quantity: 1 }],
      }),
    ]);

    // [Then] 성공/실패 판별
    const results = [r1, r2];
    const fulfilledCount = results.filter(
      (r) => r.status === "fulfilled"
    ).length;
    const rejectedCount = results.filter((r) => r.status === "rejected").length;
    expect(fulfilledCount).toBe(1);
    expect(rejectedCount).toBe(1);

    // [Then] 잔액 검증 (성공한 유저만 돈 빠졌는지)
    const uA = await userRepo.findOneByOrFail({ userId: userIds[0] });
    const uB = await userRepo.findOneByOrFail({ userId: userIds[1] });
    const balances = [uA.balance, uB.balance].sort(); // 작은 값이 먼저 오게
    expect(balances).toEqual([2000, 5000]);

    // [Then] 최종 재고는 0이어야 한다 (음수면 안됨, 1이면 oversell 안 된 거 아님)
    const productAfter = await productRepo.findOneByOrFail({
      productId: productId_A,
    });
    expect(productAfter.stock).toBe(0);
  });

  it("성공 시나리오: 재고가 정확히 10개일 때 5명이 동시에 주문하면 모두 성공하고 재고는 5가 된다", async () => {
    // [Given] 모든 참여 유저에게 5,000원씩 충전
    await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        userSvc.chargeBalance(5000, userIds[i])
      )
    );
    // [Given] B 상품 ( 재고 10 개 )
    await productRepo.save(
      productRepo.create({
        name: "B 상품",
        price: 3000,
        stock: 10,
      })
    );
    productId_B = (await productRepo.findOneByOrFail({ name: "B 상품" }))
      .productId;

    // [When] 동시에 주문 시도 (동일 상품, 수량 1)
    const results = await Promise.allSettled(
      userIds.slice(0, 5).map((id) =>
        orderSvc.execute({
          userId: id,
          items: [{ productId: productId_B, quantity: 1 }],
        })
      )
    );

    // [Then] 성공/실패 판별
    const fulfilledCount = results.filter(
      (r) => r.status === "fulfilled"
    ).length;
    const rejectedCount = results.filter((r) => r.status === "rejected").length;
    expect(fulfilledCount).toBe(5);
    expect(rejectedCount).toBe(0);

    // [Then] 잔액 검증 (성공한 유저만 돈 빠졌는지)
    const usersAfter = await Promise.all(
      userIds.slice(0, 5).map((id) => userRepo.findOneByOrFail({ userId: id }))
    );
    const balances = usersAfter.map((u) => u.balance).sort();
    expect(balances).toEqual([2000, 2000, 2000, 2000, 2000]);

    // [Then] 최종 재고는 5이어야 한다
    const productAfter = await productRepo.findOneByOrFail({
      productId: productId_B,
    });
    expect(productAfter.stock).toBe(5);
  });

  it("성공 시나리오: 재고가 정확히 10개일 때 10명이 동시에 주문하면 모두 성공하고 재고는 0이 된다", async () => {
    // [Given] 모든 참여 유저에게 5,000원씩 충전
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        userSvc.chargeBalance(5000, userIds[i])
      )
    );
    // [Given] B 상품 ( 재고 10 개 )
    await productRepo.save(
      productRepo.create({
        name: "B 상품",
        price: 3000,
        stock: 10,
      })
    );
    productId_B = (await productRepo.findOneByOrFail({ name: "B 상품" }))
      .productId;

    // [When] 동시에 주문 시도 (동일 상품, 수량 1)
    const results = await Promise.allSettled(
      userIds.slice(0, 10).map((id) =>
        orderSvc.execute({
          userId: id,
          items: [{ productId: productId_B, quantity: 1 }],
        })
      )
    );

    // [Then] 성공/실패 판별
    const fulfilledCount = results.filter(
      (r) => r.status === "fulfilled"
    ).length;
    const rejectedCount = results.filter((r) => r.status === "rejected").length;
    expect(fulfilledCount).toBe(10);
    expect(rejectedCount).toBe(0);

    // [Then] 잔액 검증 (성공한 유저만 돈 빠졌는지)
    const usersAfter = await Promise.all(
      userIds.slice(0, 10).map((id) => userRepo.findOneByOrFail({ userId: id }))
    );
    const balances = usersAfter.map((u) => u.balance).sort();
    expect(balances).toEqual([
      2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000, 2000,
    ]);

    // [Then] 최종 재고는 0이어야 한다
    const productAfter = await productRepo.findOneByOrFail({
      productId: productId_B,
    });
    expect(productAfter.stock).toBe(0);
  });

  it("재고 5개에서 동시에 3개씩 요청하면 한 요청만 성공하고 재고는 2가 된다", async () => {
    // [Given] 유저 2명, 각각 충분한 잔액
    const u1 = userIds[0];
    const u2 = userIds[1];
    await userSvc.chargeBalance(10000, u1);
    await userSvc.chargeBalance(10000, u2);

    // [Given] C 상품 ( 재고 5개 )
    const cProduct = await productRepo.save(
      productRepo.create({
        name: "C 상품",
        price: 3000,
        stock: 5,
      })
    );
    const productId_C = cProduct.productId;

    // [When] 동시에 quantity=3 주문
    const [r1, r2] = await Promise.allSettled([
      orderSvc.execute({
        userId: u1,
        items: [{ productId: productId_C, quantity: 3 }],
      }),
      orderSvc.execute({
        userId: u2,
        items: [{ productId: productId_C, quantity: 3 }],
      }),
    ]);

    const results = [r1, r2];
    const fulfilledCount = results.filter(
      (r) => r.status === "fulfilled"
    ).length;
    const rejectedCount = results.filter((r) => r.status === "rejected").length;
    expect(fulfilledCount).toBe(1);
    expect(rejectedCount).toBe(1);

    // [Then] 재고 확인
    const productAfter = await productRepo.findOneByOrFail({
      productId: productId_C,
    });
    expect(productAfter.stock).toBe(2); // 5 - 3

    // [Then] 잔액 확인 (성공자만 결제됨)
    const afterU1 = await userRepo.findOneByOrFail({ userId: u1 });
    const afterU2 = await userRepo.findOneByOrFail({ userId: u2 });
    const balances = [afterU1.balance, afterU2.balance].sort();
    // 한 명은 10000- (3 * 3000 = 9000) = 1000
    // 한 명은 여전히 10000
    expect(balances).toEqual([1000, 10000]);
  });

  it("트랜잭션 도중 실패하면 재고 차감도 롤백되어야 한다", async () => {
    // [Given] 유저 한 명 (잔액 부족 상태)
    const u = userIds[0];
    // 충전 안 함, 또는 아주 적게만 충전
    await userSvc.chargeBalance(1000, u); // 상품은 3000원이라 일부러 부족

    // [Given] D 상품(stock=5, price=3000)
    const dProduct = await productRepo.save(
      productRepo.create({
        name: "D 상품",
        price: 3000,
        stock: 5,
      })
    );
    const productId_D = dProduct.productId;

    // [When/Then] 주문 시도 → 실패해야 함
    await expect(
      orderSvc.execute({
        userId: u,
        items: [{ productId: productId_D, quantity: 1 }],
      })
    ).rejects.toBeDefined();

    // [Then] 재고 롤백 확인: 여전히 5여야 한다
    const productAfter = await productRepo.findOneByOrFail({
      productId: productId_D,
    });
    expect(productAfter.stock).toBe(5);

    // [Then] 주문이 실제로 만들어지지 않았는지 확인 (DB에 없는지)
    const orders = await orderRepo.find();
    expect(orders.length).toBe(0);

    // [Then] outbox에도 이벤트가 남으면 안 된다
    const outboxRecords = await outboxRepo.find();
    expect(outboxRecords.length).toBe(0);
  });

  // afterAll(async () => {
  //   // 1) DB 커넥션 닫기
  //   if (ds && ds.isInitialized) {
  //     await ds.destroy();
  //   }

  //   // 2) Nest 모듈 닫기 (내부 provider 들의 onModuleDestroy / onApplicationShutdown를 호출하게 됨)
  //   await moduleRef.close();
  // });
});
