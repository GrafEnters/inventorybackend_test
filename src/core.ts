import {type UUID} from "node:crypto";
import type {IItemInstance} from "./iitemInstance.js";
import {PlayerRegistry} from "./playerRegistry.js";
import type {IStorageWithFilters} from "./IStorageWithFilters.js";
import type {ItemTypeRegistry} from "./items/itemTypeRegistry.js";
import {InventoryFiller} from "./inventoryFiller.js";
import type {Result} from "./result.js";
import type {ItemContext} from "./itemContext.js";
import {PosMath} from "./pos.js";
import type {GameConfig} from "./config.js";
import type {TickProvider} from "./tickProvider.js";

export class Core {

    private readonly _players: PlayerRegistry;
    private readonly _storage: IStorageWithFilters;
    private readonly _itemTypeRegistry: ItemTypeRegistry;
    private readonly _tickProvider: TickProvider;
    private readonly _gameConfig: GameConfig;

    constructor(players: PlayerRegistry, storage: IStorageWithFilters, itemTypeRegistry: ItemTypeRegistry, tickProvider: TickProvider, config: GameConfig) {
        this._players = players;
        this._storage = storage;
        this._itemTypeRegistry = itemTypeRegistry;
        this._tickProvider = tickProvider;
        this._gameConfig = config;
    }

    async dropItem(playerId: UUID, itemId: UUID): Promise<void> {
        const context = await this.loadItemContext(playerId, itemId);
        context.inventory.splice(context.itemIndex, 1);
        await this._storage.setInventory(playerId, context.inventory);
        await this._storage.addGroundItem(context.item, context.player.pos, this._tickProvider.tick);
        context.itemType.onDrop(context.player);
    }

    async pickupItem(playerId: UUID, groundItemId: UUID): Promise<Result> {
        const player = this._players.get(playerId);
        if (player === undefined) {
            throw new Error(`Player not found: ${playerId}`);
        }
        const inventory = await this._storage.getInventory(playerId);
        const groundItem = await this._storage.getGroundItem(groundItemId);
        if (groundItem === null) {
            return {ok: false, reason: "GroundItem not found"};
        }
        const itemType = this._itemTypeRegistry.getItemType(groundItem.typeId);
        if (itemType === undefined) {
            throw new Error(`Unknown type: ${groundItem.typeId}`);
        }

        if (!PosMath.isNear(player.pos, groundItem.pos, this._gameConfig.pickupRadius)) {
            return {ok: false, reason: "Too far away"};
        }
        const deleted = await this._storage.deleteGroundItem(groundItem.id);
        if (deleted === null) {
            return {ok: false, reason: "GroundItem already deleted"};
        }
        InventoryFiller.insertIntoInventory(inventory, groundItem.typeId, itemType.maxStack, groundItem.amount);
        await this._storage.setInventory(playerId, inventory);
        itemType.onPickup(player);
        return {ok: true};
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


    async useItem(playerId: UUID, itemId: UUID): Promise<Result> {
        const context = await this.loadItemContext(playerId, itemId);
        const useResult = context.itemType.onUse(context.player);
        if (!useResult.ok) {
            return useResult;
        }
        context.item.amount--;
        if (context.item.amount === 0) {
            context.inventory.splice(context.itemIndex, 1);
        }

        await this._storage.setInventory(playerId, context.inventory);
        return useResult;
    }

    async clearOldItems(): Promise<void> {
        const oldItems = await this._storage.getGroundItemsOlderThanTick(this._tickProvider.tick - this._gameConfig.itemLifetimeTicks);
        await this._storage.deleteGroundItems(oldItems.map(i => i.id));
    }

    private async loadItemContext(playerId: UUID, itemId: UUID): Promise<ItemContext> {
        const player = this._players.get(playerId);
        if (player === undefined) {
            throw new Error(`Player not found: ${playerId}`);
        }
        const inventory = await this._storage.getInventory(playerId);
        const itemIndex = inventory.findIndex(i => i.id === itemId);
        const item = inventory[itemIndex];
        if (!item) {
            throw new Error(`Item not found: ${itemId}`);
        }
        const itemType = this._itemTypeRegistry.getItemType(item.typeId);
        if (itemType === undefined) {
            throw new Error(`Unknown type: ${item.typeId}`);
        }
        return {player, inventory, item, itemIndex, itemType};
    }
}


