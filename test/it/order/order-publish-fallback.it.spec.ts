import { Test } from "@nestjs/testing";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";

import { AuthModule } from "../../../src/auth/auth.module";
import { UserModule } from "../../../src/user/user.module";
import { OrderModule } from "../../../src/order/module/order.module";

import { AuthService } from "../../../src/auth/auth.service";
import { UserService } from "../../../src/user/user.service";
import { OrderService } from "../../../src/order/usecase/order.service";

import { UserEntity } from "../../../src/user/entities/user.entity";
import { ProductEntity } from "../../../src/product/entities/product.entity";
import { OutboxEntity } from "../../../src/order/adapter/out/outbox.entity";

import { MESSAGE_PUBLISHER_PORT } from "../../../src/order/port/out/message-publisher.port";

describe("발행 실패 → Outbox 폴백 (Integration)", () => {
  let ds: DataSource;
  let authSvc: AuthService;
  let userSvc: UserService;
  let orderSvc: OrderService;
  let userRepo: Repository<UserEntity>;
  let productRepo: Repository<ProductEntity>;
  let outboxRepo: Repository<OutboxEntity>;

  beforeAll(async () => {
    const failingPublisher = {
      publish: jest.fn().mockRejectedValue(new Error("publish failed!")),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [__dirname + "/../../../src/**/*.entity.{ts,js}"],
          synchronize: true,
          dropSchema: true,
        }),
        AuthModule,
        UserModule,
        OrderModule,
      ],
    })
      .overrideProvider(MESSAGE_PUBLISHER_PORT) // 실패 목으로 교체
      .useValue(failingPublisher)
      .compile();

    ds = moduleRef.get(DataSource);
    authSvc = moduleRef.get(AuthService);
    userSvc = moduleRef.get(UserService);
    orderSvc = moduleRef.get(OrderService);

    userRepo = moduleRef.get(getRepositoryToken(UserEntity));
    productRepo = moduleRef.get(getRepositoryToken(ProductEntity));
    outboxRepo = moduleRef.get(getRepositoryToken(OutboxEntity));
  });

  beforeEach(async () => {
    await ds.synchronize(true);
  });

  it("퍼블리시 실패해도 주문은 성공 & Outbox는 남는다", async () => {
    // Given
    const user = await authSvc.signUp("김민수");
    await userSvc.chargeBalance(5000, user.userId);
    const prod = await productRepo.save(
      productRepo.create({ name: "샘플", price: 3000, stock: 10 })
    );

    // When (발행 실패는 이미 overrideProvider로 세팅됨)
    const res = await orderSvc.execute({
      userId: user.userId,
      items: [{ productId: prod.productId, quantity: 1 }],
    });

    // Then: 주문은 성공(커밋)
    expect(res.paidAmount).toBe(3000);

    // Then: Outbox에 이벤트 1건 이상 존재
    const out = await outboxRepo.find({ where: { topic: "order.created" } });
    expect(out.length).toBe(1);

    // payload(simple-json) 바로 비교
    expect(out[0].payload).toMatchObject({
      orderId: res.orderId,
      userId: user.userId,
      totalAmount: 3000,
      status: "PAID",
      items: [{ productId: prod.productId, quantity: 1, unitPrice: 3000 }],
    });
  });
});
