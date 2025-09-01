import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Coupon } from "src/coupon/entities/coupon.entity";

@Entity("user_coupons")
export class UserCoupon {
  @PrimaryGeneratedColumn()
  user_coupon_id: number;

  @ManyToOne(() => User, (user) => user.user_coupons, { nullable: false })
  user: User;

  @ManyToOne(() => Coupon, (coupon) => coupon.user_coupons, { nullable: false })
  coupon: Coupon;

  @Column({ type: "timestamp", nullable: true })
  used_at: Date | null;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deleted_at: Date | null;

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date;
}
