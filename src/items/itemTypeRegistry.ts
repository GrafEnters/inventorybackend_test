import type {ItemType} from "./itemType.js";

export class ItemTypeRegistry {
    private readonly map: Map<string, ItemType> = new Map();

    public addItemType(item: ItemType): void {
        if (this.map.has(item.typeId)) {
            throw new Error(`Item with type ${item.typeId} is already registered.`);
        }
        this.map.set(item.typeId, item);
    }

    public getItemType(type: string): ItemType | undefined {
        return this.map.get(type);
    }
}