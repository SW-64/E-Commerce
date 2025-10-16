// adapter/out/typeorm-user-account.adapter.ts
import { Repository, MoreThanOrEqual } from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { UserAccountPort } from "../../port/out/user-account.port";

export class TypeOrmUserAccountAdapter implements UserAccountPort {
  constructor(private readonly repo: Repository<UserEntity>) {}

  async findById(userId: number) {
    const user = await this.repo.findOne({ where: { userId } });
    return user ? { userId: user.userId, balance: user.balance } : null;
  }

  async decrementIfEnough(userId: number, amount: number): Promise<void> {
    const res = await this.repo.decrement(
      { userId, balance: MoreThanOrEqual(amount) }, // 조건: balance >= amount
      "balance",
      amount
    );

    if (!res.affected) {
      throw new Error("Insufficient balance");
    }
  }
}
