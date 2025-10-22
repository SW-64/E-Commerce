// test/it/setup.ts
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { UserModule } from "../../src/user/user.module";
import { OrderModule } from "../../src/order/module/order.module";
import { AuthModule } from "../../src/auth/auth.module";

export async function createItModule() {
  const moduleRef = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: "sqlite",
        database: ":memory:",
        entities: [__dirname + "/../../src/**/*.entity.{ts,js}"],
        synchronize: true,
        dropSchema: true,
      }),
      UserModule,
      OrderModule,
      AuthModule,
    ],
  }).compile();

  return {
    moduleRef,
    dataSource: moduleRef.get(DataSource),
  };
}
