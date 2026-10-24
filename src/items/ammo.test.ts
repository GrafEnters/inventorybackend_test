import {describe, it} from "node:test";
import {Player} from "../player.js";
import {randomUUID} from "node:crypto";
import assert from "node:assert/strict";
import {Ammo} from "./ammo.js";

describe("Ammo", () => {
    it("Ammo refill works", () => {
        const player = new Player(randomUUID(), {x: 0, y: 0}, 10, 10, 10);
        const refillAmount = 30;
        const armor = new Ammo("ammo", 1, refillAmount);

        assert.ok(armor.onUse(player).ok);
        assert.equal(player.ammo, 40);

    });
});