import type {UUID} from "node:crypto";
import type {IItemInstance} from "./iitemInstance.js";

export class Core{
    async dropItem(playerId: UUID, itemId: UUID): Promise<void> {
    }

    async getInventory(playerId: UUID): Promise<IItemInstance[]> {
        return [];
    }

    async giveItem(playerId: UUID, itemType: string, amount?: number): Promise<void> {
    }

    async pickupItem(playerId: UUID, groundItemId: number): Promise<void> {
    }

    async useItem(playerId: UUID, itemId: UUID): Promise<void> {
    }
}


