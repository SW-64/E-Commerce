import { OrderItem } from "src/order-item/entities/order-item.entity";
export declare class Product {
    product_id: number;
    name: string;
    price: number;
    stock: number;
    created_at: Date;
    updated_at: Date;
    order_items: OrderItem[];
}
