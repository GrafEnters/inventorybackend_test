import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {NumberInRange} from "./numberInRange.js";

describe("NumberInRange", () => {
    it("Out of range default value", () => {
        const tooBigDefault = new NumberInRange(0, 100, 150);
        assert.equal(tooBigDefault.value, 100);
        const tooSmallDefault = new NumberInRange(0, 100, -50);
        assert.equal(tooSmallDefault.value, 0);
    });

    it("Clamping works", () => {
        const val = new NumberInRange(0, 100, 50);
        val.value = -10;
        assert.equal(val.value, 0);
        val.value = 10000;
        assert.equal(val.value, 100);
    });

    it("Max greater than min", () => {
        assert.throws(() => new NumberInRange(100, 0, 50), RangeError);
    });
    it("Nan doest rewrite value", () => {
        const val = new NumberInRange(0, 100, 50);
        val.value = 75;
        assert.throws(() => val.value = NaN, RangeError);
        assert.equal(val.value, 75);
    });
});