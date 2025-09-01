import { User } from "src/user/entities/user.entity";
import { Coupon } from "src/coupon/entities/coupon.entity";
export declare class UserCoupon {
    user_coupon_id: number;
    user: User;
    coupon: Coupon;
    used_at: Date | null;
    deleted_at: Date | null;
    created_at: Date;
}
