import {
  Controller,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Inject,
} from "@nestjs/common";
import { CreateOrderDto } from "src/order/adapter/in/dto/create-order.dto";
import {
  CREATE_ORDER_USECASE,
  CreateOrderUseCase,
} from "src/order/port/in/create-order.use-case";

@Controller("/users/:userId/order")
export class OrderController {
  constructor(
    @Inject(CREATE_ORDER_USECASE)
    private readonly orderUseCase: CreateOrderUseCase
  ) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    const cmd = {
      userId,
      items: createOrderDto.items,
    };
    const result = await this.orderUseCase.execute(cmd);
    return result;
  }
}
