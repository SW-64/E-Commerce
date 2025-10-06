import { Repository } from "typeorm";
import { OrderEntity, OrderStatus } from "./order.entity";
import { OrderRepositoryPort } from "src/order/port/out/order.repository";
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

  async findById(orderId: number): Promise<Order | null> {
    const entity = await this.repo.findOne({ where: { orderId } });
    if (!entity) return null;
    return new Order(
      entity.user.userId,
      entity.items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      entity.status,
      entity.totalAmount,
      entity.paidAmount,
      entity.orderId
    ); 
  }
}
