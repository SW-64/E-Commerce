// adapter/out/typeorm-product-catalog.adapter.ts
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { ProductEntity } from "src/product/entities/product.entity";
import {
  ProductCatalogPort,
  ProductSnapshot,
} from "../../port/out/product-catalog.port";

export class TypeOrmProductCatalogAdapter implements ProductCatalogPort {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly products: Repository<ProductEntity>
  ) {}

  async findByIds(ids: number[]): Promise<ProductSnapshot[]> {
    if (!ids.length) return [];
    const rows = await this.products.find({
      where: { productId: In(ids) },
      select: { productId: true, price: true, name: true, stock: true },
    });
    return rows.map((r) => ({
      productId: r.productId,
      price: r.price,
      name: r.name,
      stock: r.stock,
    }));
  }
}
