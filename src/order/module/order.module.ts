import { Module } from "@nestjs/common";
import { OrderService } from "../usecase/order.service";
import { OrderController } from "../adapter/in/order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { OrderEntity } from "../adapter/out/order.entity";
import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";
import { Coupon } from "src/coupon/entities/coupon.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";
import { ProductEntity } from "src/product/entities/product.entity";
import { Order } from "../domain/order";
import { TypeOrmInventoryAdapter } from "../adapter/out/typeorm-inventory.repository";
import { TypeOrmOrderRepository } from "../adapter/out/typeorm-order.repository";
import { TypeOrmTransaction } from "../adapter/out/typeorm-transaction.repository";
import { TypeOrmUserAccountAdapter } from "../adapter/out/typeorm-user-account.repository";
import { CREATE_ORDER_USECASE } from "src/order/port/in/create-order.use-case";
import { TRANSACTION_PORT } from "../port/out/transaction.port";
import { PRODUCT_CATALOG_PORT } from "../port/out/product-catalog.port";
import { TypeOrmProductCatalogAdapter } from "../adapter/out/typeorm-product-catalog.adapter";
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OrderEntity,
      UserCoupon,
      Coupon,
      OrderItem,
      ProductEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    Order,
    TypeOrmInventoryAdapter,
    TypeOrmOrderRepository,
    TypeOrmTransaction,
    TypeOrmUserAccountAdapter,
    {
      provide: CREATE_ORDER_USECASE,
      useClass: OrderService,
    },
    { provide: TRANSACTION_PORT, useClass: TypeOrmTransaction },
    { provide: PRODUCT_CATALOG_PORT, useClass: TypeOrmProductCatalogAdapter },
  ],
})
export class OrderModule {}
