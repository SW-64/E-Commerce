// adapter/out/typeorm-unit-of-work.ts

import { DataSource } from "typeorm";
import { TransactionPort, TxContext } from "../../port/out/transaction.port";
import { TypeOrmOrderRepository } from "./typeorm-order.repository";
import { TypeOrmInventoryAdapter } from "./typeorm-inventory.repository";
import { TypeOrmUserAccountAdapter } from "./typeorm-user-account.repository";
import { OrderEntity } from "./order.entity";
import { ProductEntity } from "../../../../src/product/entities/product.entity";
import { UserEntity } from "../../../../src/user/entities/user.entity";
import { TypeOrmOutboxAdapter } from "./typeorm-outbox.adapter";
import { OutboxEntity } from "./outbox.entity";

export class TypeOrmTransaction implements TransactionPort {
  constructor(private readonly ds: DataSource) {}

  async withTransaction<T>(work: (tx: TxContext) => Promise<T>): Promise<T> {
    return this.ds.transaction(async (manager) => {
      const tx: TxContext = {
        orders: new TypeOrmOrderRepository(manager.getRepository(OrderEntity)),
        inventory: new TypeOrmInventoryAdapter(
          manager.getRepository(ProductEntity)
        ),
        users: new TypeOrmUserAccountAdapter(manager.getRepository(UserEntity)),
        outbox: new TypeOrmOutboxAdapter(manager.getRepository(OutboxEntity)),
      };
      return work(tx);
    });
  }
}
