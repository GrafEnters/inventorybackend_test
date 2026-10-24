import type {Player} from "./player.js";
import type {IItemInstance} from "./iitemInstance.js";
import type {ItemType} from "./items/itemType.js";

export type ItemContext =
    {
        player: Player,
        inventory: IItemInstance[],
        item: IItemInstance,
        itemIndex: number,
        itemType: ItemType
    }