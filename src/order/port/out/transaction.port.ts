// port/out/unit-of-work.port.ts

import { OrderRepositoryPort } from "./order.repository";
import { InventoryPort } from "./inventory.port";
import { UserAccountPort } from "./user-account.port";

// 트랜잭션 안에서 사용할 수 있는 Repository들의 모음집
export interface TxContext {
  orders: OrderRepositoryPort;
  inventory: InventoryPort;
  users: UserAccountPort;
}

// TxContext을 하나의 트랜잭션 단위로 묶기 위한 포트
export interface TransactionPort {
  withTransaction<T>(work: (tx: TxContext) => Promise<T>): Promise<T>;
}

export const TRANSACTION_PORT = Symbol("TRANSACTION_PORT");
