export interface InventoryPort {
  // 재고 확인 및 차감
  ensureAndDecrement(
    bulk: { productId: number; quantity: number }[]
  ): Promise<void>;
}
