import { Order } from "src/order/entities/order.entity";
import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";
export declare class User {
    user_id: number;
    name: string;
    balance: number;
    created_at: Date;
    updated_at: Date;
    orders: Order[];
    user_coupons: UserCoupon[];
}
