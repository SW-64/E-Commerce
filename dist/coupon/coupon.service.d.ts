import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
export declare class CouponService {
    create(createCouponDto: CreateCouponDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateCouponDto: UpdateCouponDto): string;
    remove(id: number): string;
}
