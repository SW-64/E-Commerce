import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { Order } from "./entities/order.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";
export declare class OrderService {
    private readonly userRepository;
    private readonly productRepository;
    private readonly orderRepository;
    private readonly orderItemRepository;
    constructor(userRepository: Repository<User>, productRepository: Repository<Product>, orderRepository: Repository<Order>, orderItemRepository: Repository<OrderItem>);
    create(userId: number, items: {
        productId: number;
        quantity: number;
    }[]): Promise<void>;
}
