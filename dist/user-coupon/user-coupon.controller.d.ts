import { UserCouponService } from './user-coupon.service';
import { CreateUserCouponDto } from './dto/create-user-coupon.dto';
import { UpdateUserCouponDto } from './dto/update-user-coupon.dto';
export declare class UserCouponController {
    private readonly userCouponService;
    constructor(userCouponService: UserCouponService);
    create(createUserCouponDto: CreateUserCouponDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateUserCouponDto: UpdateUserCouponDto): string;
    remove(id: string): string;
}
