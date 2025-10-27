import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEntity } from "./entities/product.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ProductEntity, OrderItem])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
