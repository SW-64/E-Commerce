// usecase/order.service.ts
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import {
  CreateOrderUseCase,
  CreateOrderCommand,
  CreateOrderResult,
} from "../port/in/create-order.use-case";
import {
  TRANSACTION_PORT,
  TransactionPort,
} from "../port/out/transaction.port";
import { ProductCatalogPort } from "../port/out/product-catalog.port";
import { Order } from "../domain/order";
import { PRODUCT_CATALOG_PORT } from "./../port/out/product-catalog.port";
import { v4 as uuid } from 'uuid';

@Injectable()
export class OrderService implements CreateOrderUseCase {
  constructor(
    @Inject(TRANSACTION_PORT) private readonly transaction: TransactionPort,
    @Inject(PRODUCT_CATALOG_PORT) private readonly products: ProductCatalogPort // 💡 가격 스냅샷 주입
  ) {}

  async execute(cmd: CreateOrderCommand): Promise<CreateOrderResult> {
    // 0) 입력 병합/검증(수량 > 0 등)은 Order.create에서 최종 검증
    if (!cmd.items?.length) {
      throw new Error("No items");
    }

    // 1) 가격 스냅샷 조회
    const ids = Array.from(new Set(cmd.items.map((i) => i.productId)));
    const snaps = await this.products.findByIds(ids);
    if (snaps.length !== ids.length) {
      throw new NotFoundException("One or more products not found");
    }

    // 2) 도메인에 필요한 형식으로 아이템 구성 (quantity + unitPrice)
    const quantityMap = new Map<number, number>();
    for (const { productId, quantity } of cmd.items) {
      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new BadRequestException("Invalid quantity");
      }
      quantityMap.set(productId, (quantityMap.get(productId) ?? 0) + quantity);
    }

    const itemsWithPrice = snaps.map((snap) => ({
      productId: snap.productId,
      quantity: quantityMap.get(snap.productId)!,
      price: snap.price,
    }));

    // 3) 도메인 규칙으로 주문 생성(총액/불변식 검증 포함)
    const order = Order.create(cmd.userId, itemsWithPrice);

    // 4) 트랜잭션 내부에서 원자적으로 처리
    const result = await this.transaction.withTransaction(async (tx) => {
      // 재고 차감 (조건부 업데이트)
      await tx.inventory.ensureAndDecrement(
        order.items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
        }))
      );

      // 사용자 잔액 차감
      await tx.users.decrementIfEnough(order.userId, order.paidAmount);

      // 주문 저장
      const { orderId } = await tx.orders.save(order);

      // 상태 전환 → 저장
      order.markPaid();
      await tx.orders.updateStatus(orderId, order.status);

       // Outbox 이벤트 기록 
      await tx.outbox.save({
        topic: 'order.created',
        eventId: uuid(),
        payload: {
          occurredAt: new Date().toISOString(),
          orderId,
          userId: order.userId,
          totalAmount: order.paidAmount,
          status: order.status,
          version: 1,
          items: order.items.map(i => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })),
        },
      });

      // 반환은 타입에 맞게 status 제외
      const res: CreateOrderResult = {
        orderId,
        paidAmount: order.paidAmount,
      };
      return res;
    });

    return result;
  }
}
