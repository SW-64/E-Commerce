// domain/entity/order.ts
export type OrderItemProps = {
  productId: number;
  quantity: number;
  price: number; // 스냅샷 단가
};

export class OrderItem {
  readonly productId: number;
  readonly quantity: number;
  readonly unitPrice: number;

  private constructor(p: OrderItemProps) {
    if (!Number.isInteger(p.quantity) || p.quantity <= 0) {
      throw new Error("Invalid quantity");
    }
    if (p.price < 0) {
      throw new Error("Invalid price");
    }
    this.productId = p.productId;
    this.quantity = p.quantity;
    this.unitPrice = p.price;
  }

  static create(p: OrderItemProps) {
    return new OrderItem(p);
  }

  get lineAmount(): number {
    return this.unitPrice * this.quantity;
  }
}

export enum DomainOrderStatus { PENDING = "PENDING", PAID = "PAID", CANCELED = "CANCELED" }

export class Order {
  readonly userId: number;
  readonly items: OrderItem[];
  readonly totalAmount: number;   // 총 금액
  readonly paidAmount: number;    // 실제 결제 금액(할인 반영 시 별도)
  private _status: DomainOrderStatus = DomainOrderStatus.PENDING;

  private constructor(userId: number, items: OrderItem[]) {
    if (!items.length) throw new Error("No items");
    this.userId = userId;
    this.items = items;
    this.totalAmount = items.reduce((s, it) => s + it.lineAmount, 0);
    this.paidAmount = this.totalAmount; // 할인 정책 있으면 여기서 계산
  }

  static create(userId: number, rawItems: OrderItemProps[]): Order {
    const items = rawItems.map(OrderItem.create);
    return new Order(userId, items);
  }

  get status() { return this._status; }
  markPaid() {
    if (this._status !== DomainOrderStatus.PENDING) throw new Error("Invalid status transition");
    this._status = DomainOrderStatus.PAID;
  }
}
