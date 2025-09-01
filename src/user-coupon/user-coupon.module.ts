import { Module } from "@nestjs/common";
import { UserCouponService } from "./user-coupon.service";
import { UserCouponController } from "./user-coupon.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserCoupon } from "./entities/user-coupon.entity";
import { User } from "src/user/entities/user.entity";
import { Coupon } from "src/coupon/entities/coupon.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserCoupon, User, Coupon])],
  controllers: [UserCouponController],
  providers: [UserCouponService],
})
export class UserCouponModule {}
