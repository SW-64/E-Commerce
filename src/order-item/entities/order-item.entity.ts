import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "src/order/entities/order.entity";
import { Product } from "src/product/entities/product.entity";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  orderItemId: number;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "int" })
  unitPrice: number; // 주문 시점 가격 스냅샷

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.orderItems, { nullable: false })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, {
    nullable: false,
  })
  product: Product;
}
