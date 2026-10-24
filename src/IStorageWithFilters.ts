import type {Pos} from "./pos.js";
import type {IGroundItem} from "./iitemInstance.js";
import type {IStorage} from "./IStorage.js";

export interface IStorageWithFilters extends IStorage {

    getGroundItemsInRange(pos: Pos, range: number): Promise<IGroundItem[]>;

    getGroundItemsOlderThanTick(tick: number): Promise<IGroundItem[]>;
}