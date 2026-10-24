import type {UUID} from "node:crypto";
import type {Pos} from "./pos.js";
import type {IGroundItem, IItemInstance} from "./iitemInstance.js";

export interface IStorage {

    setInventory(playerId: UUID, inventory: IItemInstance[]): Promise<void>;

    getInventory(playerId: UUID): Promise<IItemInstance[]>;

    addGroundItem(item: IItemInstance, pos: Pos, spawnTick: number): Promise<void>;

    getGroundItem(itemId: UUID): Promise<IGroundItem|null>;

    deleteGroundItem(itemId: UUID): Promise<IItemInstance|null>;

    deleteGroundItems(itemIds: UUID[]): Promise<number>;
}