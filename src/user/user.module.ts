import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Order } from "src/order/domain/entities/order.entity";
import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Order, UserCoupon])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
