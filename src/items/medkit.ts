import {ItemType} from "./itemType.js";
import type {Player} from "../player.js";
import type {Result} from "../result.js";

export class Medkit extends ItemType {

    readonly restoreMax: number;

    constructor(type: string, maxStack: number, restoreMax: number) {
        super(type, maxStack);
        if (Number.isNaN(restoreMax) || restoreMax <= 0) {
            throw new RangeError(`RestoreMax must be greater than 0: ${restoreMax}`);
        }
        this.restoreMax = restoreMax;
    }

    onUse(player: Player): Result {
        const toRestore = this.restoreMax - player.health;
        if (toRestore > 0) {
            player.changeHealth(toRestore);
            return {ok: true};
        }
        return {ok: false, reason: "Nothing to restore"};
    }
}