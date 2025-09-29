import { Module } from "@nestjs/common";
import { OrderService } from "./order.service";
import { OrderController } from "./interface/http/order.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Order } from "./domain/entities/order.entity";
import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";
import { Coupon } from "src/coupon/entities/coupon.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";
import { Product } from "src/product/entities/product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Order,
      UserCoupon,
      Coupon,
      OrderItem,
      Product,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
