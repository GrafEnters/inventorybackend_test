import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {ItemType} from "./itemType.js";

describe("ItemType", () => {
    class TestItemType extends ItemType {
        constructor(typeId: string, maxStack: number) {
            super(typeId, maxStack);
        }
    }

    it("Max stack must be positive integer", () => {
        const normal = new TestItemType("test", 5);
        assert.equal(normal.maxStack, 5);
        assert.throws(() => new TestItemType("test", 0), RangeError);
        assert.throws(() => new TestItemType("test", -1), RangeError);
        assert.throws(() => new TestItemType("test", 1.5), RangeError);
    });
});