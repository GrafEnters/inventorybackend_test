import {ItemType} from "./itemType.js";
import type {Player} from "../player.js";
import type {Result} from "../result.js";
import {BandageEffect} from "./bandageEffect.js";

export class Bandage extends ItemType {
    readonly healPerTick: number;
    readonly duration: number;

    constructor(type: string, maxStack: number, healPerTick: number, duration: number) {
        super(type, maxStack);
        if (Number.isNaN(healPerTick) || healPerTick <= 0) {
            throw new RangeError(`HealPerTick must be greater than 0, cur: ${healPerTick}`);
        }
        if (Number.isNaN(duration) || duration <= 0) {
            throw new RangeError(`Duration must be greater than 0, cur: ${duration}`);
        }
        this.healPerTick = healPerTick;
        this.duration = duration;
    }

    onUse(player: Player): Result {
        if (player.health === player.maxHealth) {
            return {ok: false, reason: "Already max health"};
        }
        const isAdded = player.addEffect("bandage", new BandageEffect(this.duration, this.healPerTick));
        if (isAdded) {
            return {ok: true};
        }
        return {ok: false, reason: "Already active effect"};
    }
}