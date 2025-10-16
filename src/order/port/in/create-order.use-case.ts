import { Inject } from "@nestjs/common";

export type CreateOrderItem = { productId: number; quantity: number };
export type CreateOrderCommand = { userId: number; items: CreateOrderItem[] };
export type CreateOrderResult = { orderId: number; paidAmount: number };

export interface CreateOrderUseCase {
  execute(cmd: CreateOrderCommand): Promise<CreateOrderResult>;
}
export const CREATE_ORDER_USECASE = Symbol("CREATE_ORDER_USECASE");
