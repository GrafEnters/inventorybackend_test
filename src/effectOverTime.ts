import type {Player} from "./player.js";

export abstract class EffectOverTime {
    private _remainingTicks: number = 0;

    public tickEffect(player: Player) { //как запретить переопределять метод
        this._remainingTicks--;
        this.applyEffect(player);
    }

    abstract applyEffect(player: Player): void;

    public get remainingTicks() {
        return this._remainingTicks;
    }

    protected constructor(remainingTicks: number) {
        if (Number.isNaN(remainingTicks) || remainingTicks <= 0) {
            throw new RangeError(`Remaining Ticks must be greater than 0 ${remainingTicks}`);
        }
        this._remainingTicks = remainingTicks;
    }
}