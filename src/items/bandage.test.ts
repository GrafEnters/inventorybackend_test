import {describe, it} from "node:test";
import {Player} from "../player.js";
import {randomUUID} from "node:crypto";
import assert from "node:assert/strict";
import {Bandage} from "./bandage.js";

describe("Bandage", () => {

    it("Bandage heals each tick", () => {
        const player = new Player(randomUUID(), {x: 0, y: 0}, 10);
        const healPerTick = 2;
        const bandage = new Bandage("bandage", 1, healPerTick, 2);

        assert.ok(bandage.onUse(player).ok);
        assert.equal(player.health, 10);
        player.tickAllEffects();
        assert.equal(player.health, 12);
        player.tickAllEffects();
        assert.equal(player.health, 14);
        player.tickAllEffects();
        assert.equal(player.health, 14);
    });
    it("Second bandage can't be used", () => {
        const player = new Player(randomUUID(), {x: 0, y: 0}, 10);
        const healPerTick = 2;
        const bandage = new Bandage("bandage", 1, healPerTick, 2);

        assert.ok(bandage.onUse(player).ok);
        assert.equal(bandage.onUse(player).ok, false);
    });

    it("Bandage can be used again", () => {
        const player = new Player(randomUUID(), {x: 0, y: 0}, 10);
        const healPerTick = 2;
        const bandage = new Bandage("bandage", 1, healPerTick, 2);

        assert.ok(bandage.onUse(player).ok);
        player.tickAllEffects();
        player.tickAllEffects();
        assert.ok(bandage.onUse(player).ok);
        player.tickAllEffects();
        assert.equal(player.health, 16);
    });

    it("Bandage can't be used at full hp", () => {
        const player = new Player(randomUUID(), {x: 0, y: 0}, 100);
        const healPerTick = 2;
        const bandage = new Bandage("bandage", 1, healPerTick, 2);

        assert.equal(bandage.onUse(player).ok, false);
    });
});