import { createItModule } from "../setup";
import { DataSource } from "typeorm";

import { UserService } from "../../../src/user/user.service";
import { OrderService } from "../../../src/order/usecase/order.service";
import { UserEntity } from "../../../src/user/entities/user.entity";
import { ProductEntity } from "../../../src/product/entities/product.entity";
import { AuthService } from "../../../src/auth/auth.service";
import { TestingModule } from "@nestjs/testing";

describe("충전 → 주문 잔액 흐름 (Integration)", () => {
  let ds: DataSource;
  let moduleRef: TestingModule;
  let userSvc: UserService;
  let orderSvc: OrderService;
  let authSvc: AuthService;

  beforeAll(async () => {
    const setup = await createItModule();
    moduleRef = setup.moduleRef;
    ds = setup.dataSource;
    userSvc = moduleRef.get(UserService);
    orderSvc = moduleRef.get(OrderService);
    authSvc = moduleRef.get(AuthService);
  });
  afterAll(async () => {
    if (ds?.isInitialized) {
      await ds.destroy(); // DB 커넥션 풀 닫기
    }
    await moduleRef.close(); // Nest 컨테이너 / 내부 타이머 종료
  });
  beforeEach(async () => {
    await ds.synchronize(true); // 모든 테이블 초기화

    // Given: 테스트에 필요한 사용자와 상품이 존재한다
    //await ds.getRepository(UserEntity).save({ userId: 1, name: "김민수" });
    const user = await authSvc.signUp("김민수");
    await ds
      .getRepository(ProductEntity)
      .save({ productId: 101, name: "샘플", price: 3000, stock: 10 });
  });

  it("충전 후 주문 시 잔액 감소", async () => {
    // Given: 사용자가 5,000원을 충전했다
    await userSvc.chargeBalance(5000, 1);

    // When: 사용자가 3,000원짜리 상품을 주문한다
    await orderSvc.execute({
      userId: 1,
      items: [{ productId: 101, quantity: 1 }],
    });

    // Then: 주문 후 잔액이 2,000원이 되어야 한다
    const u = await ds.getRepository(UserEntity).findOneByOrFail({ userId: 1 });
    expect(u.balance).toBe(2000);
  });

  it("잔액 부족 시 주문 실패, 잔액 유지", async () => {
    // Given: 사용자가 2,000원을 충전했다 (상품 가격보다 적음)
    await userSvc.chargeBalance(2000, 1);

    // When: 사용자가 3,000원짜리 상품을 주문 시도한다
    // Then: 주문이 실패하고 에러가 발생해야 한다
    await expect(
      orderSvc.execute({
        userId: 1,
        items: [{ productId: 101, quantity: 1 }],
      })
    ).rejects.toBeDefined();

    // And: 잔액은 그대로 2,000원이어야 한다
    const u = await ds.getRepository(UserEntity).findOneByOrFail({ userId: 1 });
    expect(u.balance).toBe(2000);
  });
});
