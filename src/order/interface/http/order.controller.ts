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
import { OrderService } from "src/order/order.service";
import { CreateOrderDto } from "src/order/dto/create-order.dto";

@Controller("/users/:userId/order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @Param("userId", ParseIntPipe) userId: number
  ) {
    const result = await this.orderService.create(userId, createOrderDto.items);
    return result;
  }
}
