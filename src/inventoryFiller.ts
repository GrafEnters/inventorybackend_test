import type {IItemInstance} from "./iitemInstance.js";
import {randomUUID} from "node:crypto";

export class InventoryFiller {
    public static insertIntoInventory(inventory: IItemInstance[], typeId: string, maxStack: number, amount: number): void {
        if (!Number.isInteger(maxStack) || maxStack < 1) {
            throw new RangeError(`Max stack should be integer greater than 0: ${maxStack}`);
        }
        if (!Number.isInteger(amount) || amount < 1) {
            throw new RangeError(`Amount should be integer greater than 0: ${amount}`);
        }
        const amountLeft = this.fillExistingStacks(inventory, typeId, maxStack, amount);
        const newStacks = this.splitToStacks(typeId, maxStack, amountLeft);
        inventory.push(...newStacks);
    }

    private static fillExistingStacks(inventory: IItemInstance[], typeId: string, maxStack: number, amount: number): number {
        const unfilledSpaceInStacks = inventory.map(item => item.typeId === typeId ? Math.max(0, maxStack - item.amount) : 0);
        for (let i = 0; i < inventory.length; i++) {
            if (unfilledSpaceInStacks[i] === 0) {
                continue;
            }
            const inserted = Math.min(amount, unfilledSpaceInStacks[i]!);
            amount -= inserted;
            inventory[i]!.amount += inserted;

            if (amount === 0) {
                break;
            }
        }
        return amount;
    }

    private static splitToStacks(typeId: string, maxStack: number, amount: number): IItemInstance[] {
        const newStacks: IItemInstance[] = [];
        const fullStacksLeft = Math.floor(amount / maxStack);
        const partialLeft = amount % maxStack;
        for (let i = 0; i < fullStacksLeft; i++) {
            newStacks.push({id: randomUUID(), typeId: typeId, amount: maxStack});
        }
        if (partialLeft > 0) {
            newStacks.push({id: randomUUID(), typeId: typeId, amount: partialLeft});
        }
        return newStacks;
    }
}