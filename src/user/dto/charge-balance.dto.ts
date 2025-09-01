import { IsInt, Min, Max } from "class-validator";

export class ChargeBalanceDto {
  @IsInt()
  @Min(1) // 1원 이상만 허용 (정책에 맞게 조정)
  // @Max 아마 최대 충전 한도를 설정할 필요가 있을 것 같습니다.
  amount: number;
}
