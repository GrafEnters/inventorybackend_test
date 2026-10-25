import {ItemType} from "./itemType.js";
import type {Player} from "../player.js";
import type {Result} from "../result.js";

export class Ammo extends ItemType {
    readonly refillAmount: number;

    constructor(type: string, maxStack: number, refillAmount: number) {
        super(type, maxStack);
        if (!Number.isInteger(refillAmount) || refillAmount <= 0) {
            throw new RangeError(`RefillAmount must be a positive integer`);
        }
        this.refillAmount = refillAmount;
    }

    onUse(player: Player): Result {
        player.changeAmmo(this.refillAmount);
        return {ok: true};
    }
}