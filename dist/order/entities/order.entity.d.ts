import { User } from "src/user/entities/user.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";
export declare enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELED = "CANCELED",
    REFUNDED = "REFUNDED"
}
export declare class Order {
    order_id: number;
    user: User;
    status: OrderStatus;
    total_amount: number;
    discount_amount: number;
    paid_amount: number;
    created_at: Date;
    updated_at: Date;
    order_items: OrderItem[];
}
