import { CreateUserCouponDto } from './dto/create-user-coupon.dto';
import { UpdateUserCouponDto } from './dto/update-user-coupon.dto';
export declare class UserCouponService {
    create(createUserCouponDto: CreateUserCouponDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserCouponDto: UpdateUserCouponDto): string;
    remove(id: number): string;
}
