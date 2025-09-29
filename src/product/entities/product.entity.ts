import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderItem } from "src/order-item/entities/order-item.entity";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn({ name: "product_id" })
  productId: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "int", default: 0 })
  stock: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => OrderItem, (orderItems) => orderItems.product)
  orderItems: OrderItem[];
}
