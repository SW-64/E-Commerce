import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  // 잔액 충전 기능
  async chargeBalance(amount: number, userId: number) {
    const existedUser = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!existedUser) {
      throw new NotFoundException("User not found");
    }
    const newBalance = existedUser.balance + amount;
    await this.userRepository.update(userId, {
      balance: newBalance,
    });

    const updatedUser = await this.userRepository.findOne({
      where: { userId: userId },
      select: {
        userId: true,
        balance: true,
      },
    });
    return updatedUser;
  }
}
