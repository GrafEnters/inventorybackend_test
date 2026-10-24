import {describe, it} from "node:test";
import assert from "node:assert/strict";
import type {IItemInstance} from "./iitemInstance.js";
import {InventoryFiller} from "./inventoryFiller.js";
import {randomUUID} from "node:crypto";


describe("InventoryFiller", () => {
    it("Filler create slots and split into maxstacks", () => {
        const inventory: IItemInstance[] = [];
        InventoryFiller.insertIntoInventory(inventory, "testItem", 10, 25);
        assert.ok(inventory[0]);
        assert.ok(inventory[1]);
        assert.ok(inventory[2]);
        assert.equal(inventory[0].amount, 10);
        assert.equal(inventory[1].amount, 10);
        assert.equal(inventory[2].amount, 5);
    });

    it("No empty slot", () => {
        const inventory: IItemInstance[] = [];
        InventoryFiller.insertIntoInventory(inventory, "testItem", 10, 20);
        assert.equal(inventory.length, 2);
    });

    it("Unstackable items", () => {
        const inventory: IItemInstance[] = [];
        InventoryFiller.insertIntoInventory(inventory, "testItem", 1, 3);
        assert.ok(inventory[0]);
        assert.ok(inventory[1]);
        assert.ok(inventory[2]);
        assert.equal(inventory[0].amount, 1);
        assert.equal(inventory[1].amount, 1);
        assert.equal(inventory[2].amount, 1);
        assert.equal(inventory.length, 3);
    });
    it("Stack filled", () => {
        const inventory: IItemInstance[] = [];
        inventory.push({id: randomUUID(), typeId: "testItem", amount: 5});
        InventoryFiller.insertIntoInventory(inventory, "testItem", 10, 3);
        assert.ok(inventory[0]);
        assert.equal(inventory[0].amount, 8);
        assert.equal(inventory.length, 1);
    });

    it("Stack overfilled", () => {
        const inventory: IItemInstance[] = [];
        inventory.push({id: randomUUID(), typeId: "testItem", amount: 5});
        InventoryFiller.insertIntoInventory(inventory, "testItem", 10, 9);
        assert.ok(inventory[0]);
        assert.ok(inventory[1]);
        assert.equal(inventory[0].amount, 10);
        assert.equal(inventory[1].amount, 4);
        assert.equal(inventory.length, 2);
    });

    it("Few stacks filled", () => {
        const inventory: IItemInstance[] = [];
        inventory.push({id: randomUUID(), typeId: "testItem", amount: 5});
        inventory.push({id: randomUUID(), typeId: "testItem", amount: 2});
        inventory.push({id: randomUUID(), typeId: "testItem", amount: 3});
        InventoryFiller.insertIntoInventory(inventory, "testItem", 10, 31);
        assert.ok(inventory[0]);
        assert.ok(inventory[1]);
        assert.ok(inventory[2]);
        assert.ok(inventory[3]);
        assert.ok(inventory[4]);
        assert.equal(inventory[0].amount, 10);
        assert.equal(inventory[1].amount, 10);
        assert.equal(inventory[2].amount, 10);
        assert.equal(inventory[3].amount, 10);
        assert.equal(inventory[4].amount, 1);
    });
    it("Different types doesn't merge", () => {
        const inventory: IItemInstance[] = [];
        inventory.push({id: randomUUID(), typeId: "itemA", amount: 1});
        inventory.push({id: randomUUID(), typeId: "itemB", amount: 5});
        InventoryFiller.insertIntoInventory(inventory, "itemB", 10, 3);
        assert.ok(inventory[0]);
        assert.ok(inventory[1]);
        assert.equal(inventory[0].amount, 1);
        assert.equal(inventory[1].amount, 8);
    });

    it("Overfilled stack doesn't decrease amount", () => {
        const inventory: IItemInstance[] = [];
        inventory.push({id: randomUUID(), typeId: "testItem", amount: 20});
        InventoryFiller.insertIntoInventory(inventory, "testItem", 10, 3);
        assert.ok(inventory[0]);
        assert.ok(inventory[1]);
        assert.equal(inventory[0].amount, 20);
        assert.equal(inventory[1].amount, 3);
    });

    it("Incorrect amount throws", () => {
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", 10, 0), RangeError);
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", 10, 1.5), RangeError);
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", 10, -1), RangeError);
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", 10, NaN), RangeError);
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", 10, Infinity), RangeError);

    });
    it("Incorrect maxStack throws", () => {
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", 0, 5), RangeError);
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", 1.5, 5), RangeError);
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", -1, 5), RangeError);
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", NaN, 5), RangeError);
        assert.throws(() => InventoryFiller.insertIntoInventory([], "testItem", Infinity, 5), RangeError);

    });


});