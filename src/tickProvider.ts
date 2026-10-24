import type {TickListener} from "./tickListener.js";


export abstract class TickProvider {
    abstract get tick(): number;

    protected readonly listeners = new Set<TickListener>();

    subscribe(listener: TickListener): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
}