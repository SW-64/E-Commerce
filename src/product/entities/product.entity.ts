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
  @PrimaryGeneratedColumn()
  product_id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "int" })
  price: number;

  @Column({ type: "int", default: 0 })
  stock: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => OrderItem, (order_items) => order_items.product)
  order_items: OrderItem[];
}
