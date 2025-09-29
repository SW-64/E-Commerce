import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";
export declare class OrderItem {
    orderItemId: number;
    quantity: number;
    unitPrice: number;
    createdAt: Date;
    updatedAt: Date;
    order: Order;
    product: Product;
}
