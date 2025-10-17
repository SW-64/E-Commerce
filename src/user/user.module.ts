import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { OrderEntity } from "src/order/adapter/out/order.entity";
import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OrderEntity, UserCoupon])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
