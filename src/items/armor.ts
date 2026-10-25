import {ItemType} from "./itemType.js";
import type {Player} from "../player.js";
import type {Result} from "../result.js";

export class Armor extends ItemType {
    readonly repairAmount: number;

    constructor(type: string, maxStack: number, repairAmount: number) {
        super(type, maxStack);
        if (Number.isNaN(repairAmount) || repairAmount <= 0) {
            throw new RangeError(`RepairAmount must be greater than 0: ${repairAmount}`);
        }
        this.repairAmount = repairAmount;
    }

    onUse(player: Player): Result {
        if (player.armor < player.maxArmor) {
            player.changeArmor(this.repairAmount);
            return {ok: true};
        }
        return {ok: false, reason: "Nothing to repair"};
    }
}