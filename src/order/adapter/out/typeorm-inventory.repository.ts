// adapter/out/typeorm-inventory.adapter.ts
import { Repository, MoreThanOrEqual } from "typeorm";
import { ProductEntity } from "../../../../src/product/entities/product.entity";
import { InventoryPort } from "../../port/out/inventory.port";

export class TypeOrmInventoryAdapter implements InventoryPort {
  constructor(private readonly repo: Repository<ProductEntity>) {}

  async ensureAndDecrement(
    bulk: { productId: number; quantity: number }[]
  ): Promise<void> {
    for (const { productId, quantity } of bulk) {
      const res = await this.repo.decrement(
        { productId, stock: MoreThanOrEqual(quantity) },
        "stock",
        quantity
      );

      if (!res.affected) {
        throw new Error(`Not enough stock for product ${productId}`);
      }
    }
  }
}
