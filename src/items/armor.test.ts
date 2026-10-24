import {describe, it} from "node:test";
import {Player} from "../player.js";
import {randomUUID} from "node:crypto";
import {Armor} from "./armor.js";
import assert from "node:assert/strict";

describe("Armor", () => {
    it("Armor repair works", () => {
        const player = new Player(randomUUID(), {x: 0, y: 0}, 10, 10);
        const repairAmount = 60;
        const armor = new Armor("armor", 1, repairAmount);

        assert.ok(armor.onUse(player).ok);
        assert.equal(player.armor, 70);

    });
    it("Armor not used if full armor", () => {

        const restoreMax = 60;
        const player = new Player(randomUUID(), {x: 0, y: 0}, 75, 100);
        const armor = new Armor("armor", 1, restoreMax);

        assert.equal(armor.onUse(player).ok, false);
        assert.equal(player.armor, 100);
    });
    it("Overrepair works", () => {

        const repairAmount = 60;
        const player = new Player(randomUUID(), {x: 0, y: 0}, 50, 50);
        const armor = new Armor("armor", 1, repairAmount);

        assert.equal(armor.onUse(player).ok, true);
        assert.equal(player.armor, 100);
    });
});