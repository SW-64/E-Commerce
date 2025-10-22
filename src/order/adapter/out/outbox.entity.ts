// adapter/out/outbox.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from "typeorm";

export enum OutboxStatus {
  PENDING = "PENDING",
  SENT = "SENT",
  FAILED = "FAILED",
}

@Entity("outbox")
export class OutboxEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ length: 100 })
  topic: string; // ex) 'order.created'

  @Index({ unique: true })
  @Column({ length: 64 })
  eventId: string; // uuid

  @Column({ type: "json" })
  payload: unknown;

  @Index()
  @Column({
    type: "simple-enum",
    enum: OutboxStatus,
    default: OutboxStatus.PENDING,
  })
  status: OutboxStatus;

  @CreateDateColumn()
  createdAt: Date;
}
