import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {Player} from "./player.js";
import {randomUUID} from "node:crypto";
import type {Pos} from "./pos.js";

describe("Player", () => {

    it("Constructor works", () => {
        const id = randomUUID();
        const player = new Player(id, {x: 10, y: 15}, 60, 30, 15);
        assert.equal(player.id, id);
        assert.equal(player.pos.x, 10);
        assert.equal(player.pos.y, 15);
        assert.equal(player.health, 60);
        assert.equal(player.armor, 30);
        assert.equal(player.ammo, 15);
    });

    it("Constructor with 0 health and armor", () => {
        const id = randomUUID();
        const player = new Player(id, {x: 10, y: 15}, 0, 0);
        assert.equal(player.id, id);
        assert.equal(player.health, 0);
        assert.equal(player.armor, 0);
    });

    it("Pos doesnt mutate from construction", () => {
            const pos: Pos = {x: 10, y: 15};
            const player = new Player(randomUUID(), pos, 0, 0, 15);
            pos.x = 0;
            assert.equal(player.pos.x, 10);
        }
    );
    it("Pos doesn't mutate from get", () => {
            const player = new Player(randomUUID(), {x: 10, y: 15}, 0, 0, 15);
            const pos = player.pos;
            pos.x = 0;
            assert.equal(player.pos.x, 10);
        }
    );
});