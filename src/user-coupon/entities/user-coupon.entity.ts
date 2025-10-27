import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from "typeorm";
import { UserEntity } from "../../../src/user/entities/user.entity";
import { Coupon } from "../../../src/coupon/entities/coupon.entity";

@Entity("user_coupons")
export class UserCoupon {
  @PrimaryGeneratedColumn()
  userCouponId: number;

  @Column({ nullable: true })
  usedAt: Date | null;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn({})
  createdAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.userCoupons, { nullable: false })
  user: UserEntity;

  @ManyToOne(() => Coupon, (coupon) => coupon.userCoupons, { nullable: false })
  coupon: Coupon;
}
