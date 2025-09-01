import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";
export declare class Coupon {
    coupon_id: number;
    discount_rate: number;
    remaining_count: number;
    created_at: Date;
    updated_at: Date;
    user_coupons: UserCoupon[];
}
