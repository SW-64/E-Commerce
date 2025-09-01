import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
export declare class UserService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    chargeBalance(amount: number, userId: number): Promise<User>;
}
