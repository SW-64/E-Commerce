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
  orderId: number;

  @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: "int", default: 0 })
  totalAmount: number;

  @Column({ type: "int", default: 0 })
  discountAmount: number;

  @Column({ type: "int", default: 0 })
  paidAmount: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => OrderItem, (orderItems) => orderItems.order)
  orderItems: OrderItem[];

  @ManyToOne(() => User, (user) => user.orders, { nullable: false })
  user: User;
}
