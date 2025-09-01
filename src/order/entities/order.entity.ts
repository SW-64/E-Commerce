import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";

export enum OrderStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELED = "CANCELED",
  REFUNDED = "REFUNDED",
}

@Entity("orders") // 'order'는 예약어 이슈 가능성 → 복수형 권장
export class Order {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  user: User;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: "int" })
  total_amount: number;

  @Column({ type: "int", default: 0 })
  discount_amount: number;

  @Column({ type: "int", default: 0 })
  paid_amount: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => OrderItem, (order_items) => order_items.order)
  order_items: OrderItem[];
}
