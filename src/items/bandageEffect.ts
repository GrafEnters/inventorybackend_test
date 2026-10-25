import {EffectOverTime} from "../effectOverTime.js";
import type {Player} from "../player.js";

export class BandageEffect extends EffectOverTime {

    private _healPerTick: number;

    constructor(remainingTicks: number, healPerTick: number) {
        super(remainingTicks);
        this._healPerTick = healPerTick
    }

    applyEffect(player: Player): void {
        player.changeHealth(this._healPerTick);
    }

}