import { IsArray, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "./create-order-item.dto";

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true }) // 배열 안에 있는 각 객체에 대해서도 유효성 검증
  items: CreateOrderItemDto[];
}
