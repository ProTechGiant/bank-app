export type EventMap = Record<string, any>;
export type EventKey<T extends EventMap> = string & keyof T;
export type EventReceiver<T> = (params: T) => void;
export type EventRemover = () => void;

export interface Emitter<T extends EventMap> {
  addEventListener<K extends EventKey<T>>(eventname: K, fn: EventReceiver<T[K]>): EventRemover;
}
