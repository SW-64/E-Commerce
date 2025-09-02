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
  userCouponId: number;

  @Column({ type: "timestamp", nullable: true })
  usedAt: Date | null;

  @DeleteDateColumn({ type: "timestamp", nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.userCoupons, { nullable: false })
  user: User;

  @ManyToOne(() => Coupon, (coupon) => coupon.userCoupons, { nullable: false })
  coupon: Coupon;
}
