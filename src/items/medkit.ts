import {ItemType} from "./itemType.js";
import type {Player} from "../player.js";

export class Medkit extends ItemType {

    readonly restoreMax: number;

    constructor(type: string, maxStack: number, restoreMax: number) {
        super(type, maxStack);
        if (Number.isNaN(restoreMax)) {
            throw new RangeError(`RestoreMax cannot be NaN`);
        }
        this.restoreMax = restoreMax;
    }

    onUse(player: Player): boolean {
        const toRestore = this.restoreMax - player.health;
        if (toRestore > 0) {
            player.changeHealth(toRestore);
            return true;
        }
        return false;
    }
}