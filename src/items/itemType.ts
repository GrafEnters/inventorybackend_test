import type {Player} from "../player.js";

export abstract class ItemType {
    public readonly typeId: string;
    public readonly maxStack: number;

    protected constructor(typeId: string, maxStack: number) {
        this.typeId = typeId;
        if (!Number.isInteger(maxStack)) {
            throw new RangeError(`Max stack must be integer, current: ${maxStack}`);
        }
        if (maxStack <= 0) {
            throw new RangeError(`Max stack size cannot be less than 1, current: ${maxStack}`);
        }
        this.maxStack = maxStack;
    }

    public onUse(player: Player): boolean {
        return false;
    }

    public onPickup(player: Player): void {
    }

    public onDrop(player: Player): void {
    }
}