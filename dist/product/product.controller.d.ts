import { ProductService } from "./product.service";
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    findAll(): Promise<import("./entities/product.entity").Product[]>;
}
