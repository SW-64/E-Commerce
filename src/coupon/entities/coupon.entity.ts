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
  coupon_id: number;

  @Column({ type: "int" })
  discount_rate: number;

  @Column({ type: "int", default: 0 })
  remaining_count: number;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date;

  @OneToMany(() => UserCoupon, (uc) => uc.coupon)
  user_coupons: UserCoupon[];
}
