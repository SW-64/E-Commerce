import { UserService } from "./user.service";
import { ChargeBalanceDto } from "./dto/charge-balance.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    chargeBalance(chargeBalanceDto: ChargeBalanceDto, userId: number): Promise<import("./entities/user.entity").User>;
}
