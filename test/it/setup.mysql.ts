// test/it/setup.mysql.ts
import { Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

import { UserModule } from "../../src/user/user.module";
import { OrderModule } from "../../src/order/module/order.module";
import { AuthModule } from "../../src/auth/auth.module";
import * as dotenv from "dotenv";
dotenv.config();
export async function createItModuleMySql() {
    const moduleRef = await Test.createTestingModule({
        imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST ?? "localhost",
            port: +(process.env.DB_PORT ?? 3306),
            username: process.env.DB_USER ?? "root",
            password: process.env.DB_PASS ?? "aaaa1357",
            database: process.env.DB_NAME ?? "ecom_test",
            // Nest + TypeORM 패턴
            autoLoadEntities: true,
            synchronize: true,       // 테스트 환경에서는 true 허용
            dropSchema: true,        // 매 테스트 전에 clean하게 쓸 수 있게
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
