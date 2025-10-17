// adapter/out/typeorm-outbox.adapter.ts
import { Repository } from 'typeorm';
import { OutboxEntity, OutboxStatus } from './outbox.entity';
import { OutboxPort } from 'src/order/port/out/outbox.port';

export class TypeOrmOutboxAdapter implements OutboxPort {
  constructor(private readonly repo: Repository<OutboxEntity>) {}
  async save(input: { topic: string; eventId: string; payload: unknown }) {
    await this.repo.save({
      topic: input.topic,
      eventId: input.eventId,
      payload: input.payload,
      status: OutboxStatus.PENDING,
    });
  }
}
