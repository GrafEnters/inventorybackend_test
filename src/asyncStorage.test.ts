import {describe, it} from "node:test";
import {AsyncStorage} from "./asyncStorage.js";
import {randomUUID} from "node:crypto";
import assert from "node:assert/strict";
import type {IGroundItem, IItemInstance} from "./iitemInstance.js";

describe("AsyncStorage", async () => {
    it("Double deletion of ground items", async () => {
        const storage = new AsyncStorage(10, 20);
        const item = {id: randomUUID(), typeId: "testItem", amount: 1};
        await storage.addGroundItem(item, {x: 1, y: 1}, 1);
        const first = storage.deleteGroundItem(item.id);
        const second = storage.deleteGroundItem(item.id);
        const both = [first, second];
        const results = await Promise.all(both);
        assert.equal(results.filter(i => i !== null).length, 1);
        assert.equal(results.filter(i => i === null).length, 1);
    });

    it("Min max delays must be valid", () => {
        assert.throws(() => {
            new AsyncStorage(20, 10)
        }, RangeError);
        assert.throws(() => {
            new AsyncStorage(-1, 10)
        }, RangeError);
        assert.throws(() => {
            new AsyncStorage(NaN, 10)
        }, RangeError);
        assert.throws(() => {
            new AsyncStorage(10, NaN)
        }, RangeError);
    });

    it("Storage return copies of inventory", async () => {
        const storage = new AsyncStorage(0, 0);
        const item: IItemInstance = {id: randomUUID(), typeId: "testItem", amount: 1};
        const item1: IItemInstance = {id: randomUUID(), typeId: "testItem1", amount: 1};
        const item2: IItemInstance = {id: randomUUID(), typeId: "testItem2", amount: 1};
        const inventory = [item, item1, item2];
        const playerID = randomUUID();
        await storage.setInventory(playerID, inventory);
        item.amount = 5;
        const returned = await storage.getInventory(playerID);
        assert.ok(returned[0]);
        assert.equal(returned[0].amount, 1);
        returned[0].amount = 10;
        const returned2 = await storage.getInventory(playerID);
        assert.ok(returned2[0]);
        assert.equal(returned2[0].amount, 1);
    });
    it("Storage return copies of ground item", async () => {
        const storage = new AsyncStorage(0, 0);
        const item: IItemInstance = {id: randomUUID(), typeId: "testItem", amount: 1};
        const pos = {x: 1, y: 1};
        await storage.addGroundItem(item, pos, 1);
        pos.x = 5;
        const returned = await storage.getGroundItem(item.id);
        assert.ok(returned);
        assert.equal(returned.pos.x, 1);
        assert.deepEqual(item, {id: returned.id, typeId: returned.typeId, amount: returned.amount});
        returned.spawnTick = 100;
        const returned2 = await storage.getGroundItem(item.id);
        assert.ok(returned2);
        assert.equal(returned2.spawnTick, 1);
    });


});