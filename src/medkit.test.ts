import {describe, it} from "node:test";
import assert from "node:assert/strict";
import {Player} from "./player.js";
import {randomUUID} from "node:crypto";
import {Medkit} from "./items/medkit.js";

describe("Medkit", () => {
    it("Heal works", () => {
        const player = new Player(randomUUID(), {x: 0, y: 0}, 10);
        const restoreMax = 60;
        const medkit = new Medkit("medkit", 1, restoreMax);

        assert.ok(medkit.onUse(player));
        assert.equal(player.health, restoreMax);

    });
    it("Heal not used if more than restoreMax", () => {

        const restoreMax = 60;
        const player = new Player(randomUUID(), {x: 0, y: 0}, 75);
        const medkit = new Medkit("medkit", 1, restoreMax);

        assert.equal(medkit.onUse(player), false);
        assert.equal(player.health, 75);
    });
    it("Heal not used if exactly restoreMax", () => {

        const restoreMax = 60;
        const player = new Player(randomUUID(), {x: 0, y: 0}, restoreMax);
        const medkit = new Medkit("medkit", 1, restoreMax);

        assert.equal(medkit.onUse(player), false);
        assert.equal(player.health, restoreMax);
    });
});