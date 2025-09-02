import { IsArray, ValidateNested } from "class-validator";
import { CreateOrderItemDto } from "./create-order-item.dto";
import { Type } from "class-transformer";

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true }) // 배열 안에 있는 각 객체에 대해서도 유효성 검증
  @Type(() => CreateOrderItemDto) // 배열 안에 있는 요소 타입 지정
  items: CreateOrderItemDto[];
}
