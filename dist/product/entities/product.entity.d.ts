import { OrderItem } from "src/order-item/entities/order-item.entity";
export declare class Product {
    productId: number;
    name: string;
    price: number;
    stock: number;
    createdAt: Date;
    updatedAt: Date;
    orderItems: OrderItem[];
}
