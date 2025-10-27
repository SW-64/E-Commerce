import { Repository } from "typeorm";
import { OrderEntity, OrderStatus } from "./order.entity";
import {
  OrderRepositoryPort,
  OrderView,
} from "../../../../src/order/port/out/order.repository";
import { Order } from "../../domain/order";

export class TypeOrmOrderRepository implements OrderRepositoryPort {
  constructor(private readonly repo: Repository<OrderEntity>) {}

  async save(order: Order): Promise<{ orderId: number }> {
    const savedOrder = await this.repo.save({
      totalAmount: order.totalAmount,
      paidAmount: order.totalAmount,
      status: OrderStatus.PENDING,
      user: {
        userId: order.userId,
      },
    });

    return { orderId: savedOrder.orderId };
  }

  async updateStatus(
    orderId: number,
    status: "PENDING" | "PAID" | "CANCELED"
  ): Promise<void> {
    await this.repo.update(orderId, { status: OrderStatus[status] });
  }

  async findById(id: number): Promise<OrderView | null> {
    const e = await this.repo.findOne({
      where: { orderId: id },
      relations: ["user", "items", "items.product"],
    });
    if (!e) return null;
    return {
      orderId: e.orderId,
      userId: e.user.userId,
      status: e.status,
      totalAmount: e.totalAmount,
      paidAmount: e.paidAmount,
      items: e.orderItems.map((item) => ({
        productId: item.product.productId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };
  }
}
