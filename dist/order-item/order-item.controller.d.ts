import { OrderItemService } from './order-item.service';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
export declare class OrderItemController {
    private readonly orderItemService;
    constructor(orderItemService: OrderItemService);
    create(createOrderItemDto: CreateOrderItemDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateOrderItemDto: UpdateOrderItemDto): string;
    remove(id: string): string;
}
