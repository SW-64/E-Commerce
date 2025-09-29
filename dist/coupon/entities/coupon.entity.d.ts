import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";
export declare class Coupon {
    couponId: number;
    discountRate: number;
    remainingCount: number;
    createdAt: Date;
    updatedAt: Date;
    userCoupons: UserCoupon[];
}
