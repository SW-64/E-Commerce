import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserCoupon } from "src/user-coupon/entities/user-coupon.entity";

@Entity("coupons")
export class Coupon {
  @PrimaryGeneratedColumn()
  couponId: number;

  @Column({ type: "int" })
  discountRate: number;

  @Column({ type: "int", default: 0 })
  remainingCount: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => UserCoupon, (uc) => uc.coupon)
  userCoupons: UserCoupon[];
}
