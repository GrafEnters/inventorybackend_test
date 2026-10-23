import {clearInterval} from "node:timers";

export class GameLoop {
    readonly tickIntervalMilliseconds: number;
    private intervalId: NodeJS.Timeout | null = null;
    private tick: number = 0;

    constructor(tickIntervalInSeconds: number) {
        this.tickIntervalMilliseconds = tickIntervalInSeconds * 1000;
    }

    public start(onTick: (tick: number) => void): void {
        this.stop();

        this.intervalId = setInterval(() => {
            onTick(this.tick);
            this.tick++;
        }, this.tickIntervalMilliseconds);
    }


    public stop(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

    }
}