import {ItemType} from "./itemType.js";
import type {Player} from "../player.js";
import type {Result} from "../result.js";

export class Ammo extends ItemType {
    readonly refillAmount: number;

    constructor(type: string, maxStack: number, refillAmount: number) {
        super(type, maxStack);
        if (Number.isNaN(refillAmount)) {
            throw new RangeError(`RefillAmount cannot be NaN`);
        }
        this.refillAmount = refillAmount;
    }

    onUse(player: Player): Result {
        player.changeAmmo(this.refillAmount);
        return {ok: true};
    }
}