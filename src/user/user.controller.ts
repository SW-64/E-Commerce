import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ChargeBalanceDto } from "./dto/charge-balance.dto";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 잔액 충전 기능
  @Post(":userId/balance/charge")
  async chargeBalance(
    @Body() chargeBalanceDto: ChargeBalanceDto,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    const result = await this.userService.chargeBalance(
      chargeBalanceDto.amount,
      userId
    );
    return result;
  }
}
