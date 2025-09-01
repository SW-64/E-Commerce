import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
export declare class OrderItem {
    order_items_id: number;
    order: Order;
    product: Product;
    quantity: number;
    unit_price: number;
    created_at: Date;
    updated_at: Date;
}
