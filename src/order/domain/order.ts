export type OrderStatus = "PENDING" | "PAID" | "CANCELED";

export class Order {
  constructor(
    public readonly userId: number,
    public readonly items: {
      productId: number;
      quantity: number;
      unitPrice: number;
    }[],
    public status: OrderStatus,
    public totalAmount: number,
    public paidAmount: number,
    public readonly orderId?: number // 저장 후 생김
  ) {}

  // 주문 생성 규칙
  static create(
    userId: number,
    items: { productId: number; quantity: number; price: number }[]
  ): Order {
    if (!items.length) {
      throw new Error("Order must have at least one item");
    }

    let total = 0;
    const normalized = items.map((i) => {
      if (i.quantity <= 0) throw new Error("Quantity must be greater than 0");
      total += i.quantity * i.price;
      return {
        productId: i.productId,
        quantity: i.quantity,
        unitPrice: i.price,
      };
    });

    if (total <= 0) {
      throw new Error("Total amount must be greater than 0");
    }

    return new Order(userId, normalized, "PENDING", total, total);
  }

  // 결제 완료 규칙
  markPaid() {
    if (this.status !== "PENDING") {
      throw new Error("Only pending orders can be paid");
    }
    this.status = "PAID";
  }

  // 주문 취소 규칙
  cancel() {
    if (this.status === "PAID") {
      throw new Error("Paid orders cannot be canceled");
    }
    this.status = "CANCELED";
  }
}
