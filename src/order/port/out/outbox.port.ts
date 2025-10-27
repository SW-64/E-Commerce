export interface OutboxPort {
  save(input: { topic: string; eventId: string; payload: unknown }): Promise<void>;
}
export const OUTBOX_PORT = Symbol('OUTBOX_PORT');
