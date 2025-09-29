import { Order } from "src/order/entities/order.entity";
import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";
export declare class User {
    userId: number;
    name: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
    orders: Order[];
    userCoupons: UserCoupon[];
}
