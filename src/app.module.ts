import { Module } from "@nestjs/common";
import { DatabaseModule } from "./database/database.module";
import { ProductModule } from "./product/product.module";
import { UserModule } from "./user/user.module";
import { OrderItemModule } from "./order-item/order-item.module";
import { UserCouponModule } from "./user-coupon/user-coupon.module";
import { CouponModule } from "./coupon/coupon.module";
import { OrderModule } from "./order/module/order.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    ProductModule,
    UserModule,
    OrderItemModule,
    UserCouponModule,
    CouponModule,
    OrderModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
