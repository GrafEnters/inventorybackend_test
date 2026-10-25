import {PromiseQueue} from "./promiseQueue.js";

export class PromiseQueueWithKey {
    private readonly map: Map<string, PromiseQueue> = new Map<string, PromiseQueue>();

    public append<T>(key: string, func: () => Promise<T>): Promise<T> {

        const existingQueue = this.map.get(key);
        if (existingQueue !== undefined) {
            return existingQueue.append(func);
        }
        const newQueue = new PromiseQueue(() => this.map.delete(key));

        this.map.set(key, newQueue)
        return newQueue.append(func);
    }
}