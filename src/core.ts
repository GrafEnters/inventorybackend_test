import {randomUUID, type UUID} from "node:crypto";
import type {IItemInstance} from "./iitemInstance.js";
import type {Player} from "./player.js";
import {PlayerRegistry} from "./playerRegistry.js";
import type {IStorageWithFilters} from "./IStorageWithFilters.js";
import type {ItemTypeRegistry} from "./items/itemTypeRegistry.js";
import {InventoryFiller} from "./inventoryFiller.js";

export class Core {

    private readonly _players: PlayerRegistry;
    private readonly _storage: IStorageWithFilters;
    private readonly _itemTypeRegistry: ItemTypeRegistry;

    constructor(players: PlayerRegistry, storage: IStorageWithFilters, itemTypeRegistry: ItemTypeRegistry) {
        this._players = players;
        this._storage = storage;
        this._itemTypeRegistry = itemTypeRegistry;
    }

    async dropItem(playerId: UUID, itemId: UUID): Promise<void> {
    }

    async getInventory(playerId: UUID): Promise<IItemInstance[]> {
        return this._storage.getInventory(playerId);
    }

    async giveItem(playerId: UUID, typeId: string, amount: number = 1): Promise<void> {
        const type = this._itemTypeRegistry.getItemType(typeId);
        if (type === undefined) {
            throw new RangeError(`Unknown type: ${typeId}`);
        }

        const inventory = await this._storage.getInventory(playerId);
        InventoryFiller.insertIntoInventory(inventory, typeId, type.maxStack, amount);
        await this._storage.setInventory(playerId, inventory);
    }

    async pickupItem(playerId: UUID, groundItemId: number): Promise<void> {
    }

    async useItem(playerId: UUID, itemId: UUID): Promise<void> {
    }
}


