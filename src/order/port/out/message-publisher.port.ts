export const MESSAGE_PUBLISHER_PORT = Symbol("MESSAGE_PUBLISHER_PORT");

export interface MessagePublisherPort {
  publish(topic: string, payload: unknown): Promise<void>;
}
