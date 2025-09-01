import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
export declare class ProductService {
    private readonly productRepository;
    constructor(productRepository: Repository<Product>);
    findAll(): Promise<Product[]>;
}
