import type {UUID} from "node:crypto";
import type {IGroundItem, IItemInstance} from "./iitemInstance.js";
import type {Pos} from "./pos.js";
import type {IStorageWithFilters} from "./IStorageWithFilters.js";

export class AsyncStorage implements IStorageWithFilters {

    private readonly _minDelay: number;
    private readonly _maxDelay: number;

    private readonly ground: Map<string, IGroundItem> = new Map();
    private readonly playersInventories: Map<string, IItemInstance[]> = new Map();

    public constructor(minDelay: number, maxDelay: number) {
        this._minDelay = minDelay;
        this._maxDelay = maxDelay;
        if (minDelay > maxDelay || minDelay < 0 || Number.isNaN(minDelay) || Number.isNaN(maxDelay)) {
            throw new RangeError(`Delays range are incorrect min: ${minDelay} max: ${maxDelay}`);
        }
    }

    async getInventory(playerId: UUID): Promise<IItemInstance[]> {
        const inventory = this.playersInventories.get(playerId) ?? [];
        await this.randomDelay();
        return structuredClone(inventory);
    }

    async setInventory(playerId: UUID, inventory: IItemInstance[]): Promise<void> {
        this.playersInventories.set(playerId, structuredClone(inventory));
        await this.randomDelay();
    }


    async addGroundItem(item: IItemInstance, pos: Pos, spawnTick: number): Promise<void> {
        const groundItem: IGroundItem = {...structuredClone(item), pos: structuredClone(pos), spawnTick: spawnTick};
        this.ground.set(item.id, groundItem);
        await this.randomDelay();
    }

    async getGroundItem(itemId: UUID): Promise<IGroundItem | null> {
        const item = this.ground.get(itemId);
        await this.randomDelay();

        if (item !== undefined) {
            return structuredClone(item);
        }
        return null;

    }

    async deleteGroundItem(itemId: UUID): Promise<IItemInstance | null> {
        await this.randomDelay();
        const item = this.ground.get(itemId);
        if (item !== undefined) {
            this.ground.delete(itemId);
            return {id: item.id, typeId: item.typeId, amount: item.amount};
        }
        return null;
    }

    async getGroundItemsInRange(pos: Pos, range: number): Promise<IGroundItem[]> {
        const near = [...this.ground.values()].filter(item => this.isNear(item.pos, pos, range));
        await this.randomDelay();
        return structuredClone(near);
    }


    async getGroundItemsOlderThanTick(tick: number): Promise<IGroundItem[]> {
        const older = [...this.ground.values()].filter(item => item.spawnTick < tick);
        await this.randomDelay();
        return structuredClone(older);
    }

    private async randomDelay(): Promise<void> {
        const delay = Math.random() * (this._maxDelay - this._minDelay) + this._minDelay;
        await new Promise(resolve => setTimeout(resolve, delay));
    }

    private isNear(pos1: Pos, pos2: Pos, range: number): boolean {
        return Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) <= range * range;
    }
}