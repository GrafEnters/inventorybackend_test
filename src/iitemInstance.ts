import type {UUID} from "node:crypto";
import type {Pos} from "./pos.js";

export interface IItemInstance {
    id: UUID;
    typeId: string;
    amount: number;
}

export interface IGroundItem extends IItemInstance {
    pos: Pos;
    spawnTick: number;
}