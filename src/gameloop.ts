import {clearInterval} from "node:timers";
import {TickProvider} from "./tickProvider.js";

export class GameLoop extends TickProvider {
    readonly tickIntervalMilliseconds: number;
    private intervalId: NodeJS.Timeout | null = null;
    private _tick: number = 0;

    constructor(tickIntervalInSeconds: number) {
        super();
        this.tickIntervalMilliseconds = tickIntervalInSeconds * 1000;
    }

    public start(): void {
        this.stop();

        this.intervalId = setInterval(() => {
            for (const listener of this.listeners) {
                try {
                    listener(this._tick);
                } catch (error) {
                    console.error(error);
                }
            }
            this._tick++;
        }, this.tickIntervalMilliseconds);
    }

    get tick(): number {
        return this._tick;
    }


    public stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

    }
}

