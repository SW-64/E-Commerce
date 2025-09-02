import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { Order } from "src/order/entities/order.entity";
import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "int", default: 0 })
  balance: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @OneToMany(() => UserCoupon, (uc) => uc.user)
  userCoupons: UserCoupon[];
}
