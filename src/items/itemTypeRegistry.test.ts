import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {ItemTypeRegistry} from "./itemTypeRegistry.js";
import {ItemType} from "./itemType.js";

describe("ItemTypeRegistry", () => {
    it("Identical id throws", () => {
        class TestItemType extends ItemType {
            constructor(typeId: string, maxStack: number) {
                super(typeId, maxStack);
            }
        }

        const items = new ItemTypeRegistry();
        items.addItemType(new TestItemType("test", 1));
        assert.throws(() => items.addItemType(new TestItemType("test", 1)));
    });
});