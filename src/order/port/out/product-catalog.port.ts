// port/out/product-catalog.port.ts
export type ProductSnapshot = {
  productId: number;
  price: number;
  name?: string;
  stock?: number;
};

export interface ProductCatalogPort {
  findByIds(ids: number[]): Promise<ProductSnapshot[]>;
}

export const PRODUCT_CATALOG_PORT = Symbol("PRODUCT_CATALOG_PORT");
