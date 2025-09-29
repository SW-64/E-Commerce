import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/entities/user.entity";
import { DataSource, In, MoreThanOrEqual, Repository } from "typeorm";
import { Product } from "src/product/entities/product.entity";
import { Order, OrderStatus } from "./entities/order.entity";
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
    private readonly orderItemRepository: Repository<OrderItem>,
    private dataSource: DataSource
  ) {}
  async create(
    userId: number,
    items: { productId: number; quantity: number }[]
  ) {
    // 준비 단계
    // 동일 상품 수량 병합
    const productQuantityMap = new Map<number, number>();
    for (const { productId, quantity } of items) {
      productQuantityMap.set(
        productId,
        (productQuantityMap.get(productId) ?? 0) + quantity
      );
    }
    const productIds = [...productQuantityMap.keys()];

    // 검증 단계
    // 1) 상품, 수량 존재 확인
    if (!Array.isArray(items) || items.length === 0) {
      throw new BadRequestException("No items provided");
    }

    // 2) 일괄 상품 존재 확인
    const products = await this.productRepository.find({
      where: { productId: In(productIds) },
      select: { productId: true, name: true, price: true, stock: true },
    });
    if (products.length !== productIds.length) {
      throw new NotFoundException("One or more products not found");
    }

    // 3) 재고 확인
    let payment = 0;
    for (const product of products) {
      const requestQuantity = productQuantityMap.get(product.productId);
      if (product.stock < requestQuantity) {
        throw new BadRequestException(`Not enough stock: ${product.name}`);
      }
      payment += product.price * requestQuantity;
    }

    // 4) 사용자 존재 확인
    const user = await this.userRepository.findOne({
      where: { userId },
      select: { userId: true, balance: true },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }
    // 5) 사용자 잔액 확인
    if (user.balance < payment) {
      throw new BadRequestException("User balance is not enough");
    }

    // 쓰기 단계
    await this.dataSource.transaction(async (manager) => {
      const orderRepository = manager.getRepository(Order);
      const orderItemRepository = manager.getRepository(OrderItem);
      const productRepository = manager.getRepository(Product);
      const userRepository = manager.getRepository(User);

      // 1) Order 데이터 저장
      const order = await orderRepository.save({
        userId,
        totalAmount: payment,
        discountAmount: 0,
        paidAmount: payment,
        status: OrderStatus.PENDING,
      });

      // 2) Order-Items 데이터 저장

      const orderItems = products.map((p) => ({
        orderId: order.orderId, // FK 직접 지정
        productId: p.productId,
        quantity: productQuantityMap.get(p.productId)!,
        unitPrice: p.price,
      }));
      // 여러개 save 하는 것보다 하나로 insert
      await orderItemRepository.insert(orderItems);

      // 3) 상품 재고 차감
      for (const p of products) {
        const quantity = productQuantityMap.get(p.productId)!;

        await productRepository.decrement(
          { productId: p.productId, stock: MoreThanOrEqual(quantity) }, // 조건: 재고 충분할 때만
          "stock",
          quantity
        );
      }

      // 4) 사용자 잔액 차감
      const dec = await userRepository.decrement(
        { userId, balance: MoreThanOrEqual(payment) },
        "balance",
        payment
      );
      if (dec.affected !== undefined && dec.affected === 0) {
        throw new BadRequestException("Failed to decrement user balance");
      }

      // 5) 주문 상태 전환 (성공 시)
      await orderRepository.update(order.orderId, {
        status: OrderStatus.PAID,
      });
    });

    return;
  }
}
