import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderEntity } from "../../../src/order/adapter/out/order.entity";
import { ProductEntity } from "../../../src/product/entities/product.entity";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  orderItemId: number;
  s;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "int" })
  unitPrice: number; // 주문 시점 가격 스냅샷

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => OrderEntity, (order) => order.orderItems, {
    nullable: false,
  })
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderItems, {
    nullable: false,
  })
  product: ProductEntity;
}
