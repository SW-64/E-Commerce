import { User } from "src/user/entities/user.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";
export declare enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    CANCELED = "CANCELED",
    REFUNDED = "REFUNDED"
}
export declare class Order {
    orderId: number;
    status: OrderStatus;
    totalAmount: number;
    discountAmount: number;
    paidAmount: number;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
    user: User;
}
