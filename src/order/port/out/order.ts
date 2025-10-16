// entity/order.ts
export class Order {
  private id?: number;

  private constructor(
    private readonly productName: string,
    private readonly qty: number,
    private readonly unitPrice: number
  ) {}

  static create(product: string, qty: number, price: number): Order {
    return new Order(product, qty, price);
  }

  totalPrice(): number {
    return this.qty * this.unitPrice;
  }

  assignId(id: number): void {
    this.id = id;
  }

  getId() {
    return this.id;
  }
  getProductName() {
    return this.productName;
  }
  getQty() {
    return this.qty;
  }
  getUnitPrice() {
    return this.unitPrice;
  }
}
