import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { Repository } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { Order } from "./entities/order.entity";
import { OrderItem } from "src/order-item/entities/order-item.entity";

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>
  ) {}
  async create(
    userId: number,
    items: { productId: number; quantity: number }[]
  ) {
    // 0. 사전 준비
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });
    const products = await this.productRepository.findOne(
      items.map((item) => item.productId)
    );
    console.log(products);
    // 1. 결제
    // 2. 재고 관리

    // 3. 주문 내역 저장
    // 4. 주문 목록 내역 저장
    // 5. 사용자 포인트 사용
  }
}
