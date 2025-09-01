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
  order_items_id: number;

  @ManyToOne(() => Order, (order) => order.order_items, { nullable: false })
  order: Order;

  @ManyToOne(() => Product, (product) => product.order_items, {
    nullable: false,
  })
  product: Product;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "int" })
  unit_price: number; // 주문 시점 가격 스냅샷

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;
}
