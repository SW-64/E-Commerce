import { User } from "src/user/entities/user.entity";
import { Coupon } from "src/coupon/entities/coupon.entity";
export declare class UserCoupon {
    userCouponId: number;
    usedAt: Date | null;
    deletedAt: Date | null;
    createdAt: Date;
    user: User;
    coupon: Coupon;
}
