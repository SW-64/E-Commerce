import { Order } from "../../domain/order";

export interface OrderRepositoryPort {
  // Order 데이터 저장
  save(order: Order): Promise<{ orderId: number }>;

  // Order 상태 업데이트
  updateStatus(
    orderId: number,
    status: "PENDING" | "PAID" | "CANCELED"
  ): Promise<void>;

  // ID로 Order 조회
  findById(orderId: number): Promise<Order | null>;
}
