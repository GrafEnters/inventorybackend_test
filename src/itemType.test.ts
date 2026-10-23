import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {ItemType} from "./items/itemType.js";

describe("ItemType", () => {
    it("Max stack must be positive integer", () => {
        class TestItemType extends ItemType {
            constructor(typeId: string, maxStack: number) {
                super(typeId, maxStack);
            }
        }

        const normal = new TestItemType("test", 5);
        assert.equal(normal.maxStack, 5);
        assert.throws(() => new TestItemType("test", 0),RangeError);
        assert.throws(() => new TestItemType("test", -1),RangeError);
        assert.throws(() => new TestItemType("test", 1.5),RangeError);
    });
});