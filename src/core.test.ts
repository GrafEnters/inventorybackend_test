import {describe, it} from "node:test";
import {Core} from "./core.js";
import {ItemTypeRegistry} from "./items/itemTypeRegistry.js";
import {ItemType} from "./items/itemType.js";
import {PlayerRegistry} from "./playerRegistry.js";
import {AsyncStorage} from "./asyncStorage.js";
import {Player} from "./player.js";
import assert from "node:assert/strict";
import type {Result} from "./result.js";
import type {GameConfig} from "./config.js";
import {randomUUID} from "node:crypto";
import type {IItemInstance} from "./iitemInstance.js";
import {TickProvider} from "./tickProvider.js";

describe("Core", () => {

    class TestItemType extends ItemType {
        private _usable: boolean;

        constructor(typeId: string, maxStack: number, usable: boolean = true) {
            super(typeId, maxStack);
            this._usable = usable;
        }

        onUse(player: Player): Result {
            if (this._usable) {
                return {ok: true};
            } else {
                return {ok: false, reason: "Unusable test item"};
            }

        }
    }

    class Add1AmmoItemType extends ItemType {
        constructor(typeId: string, maxStack: number) {
            super(typeId, maxStack);
        }

        onUse(player: Player): Result {
            player.changeAmmo(1);
            return {ok: true};
        }
    }


    class TestTickProvider extends TickProvider {
        private _tick: number = 0;
        get tick(): number {
            return this._tick;
        }

        set tick(tick: number) {
            this._tick = tick;
        }

    }

    const testConfig: GameConfig = {pickupRadius: 5, itemLifetimeTicks: 60};

    function setup(maxDelay: number = 0) {
        const items = new ItemTypeRegistry();
        const players = new PlayerRegistry();
        const storage = new AsyncStorage(0, maxDelay);
        const gameLoop = new TestTickProvider();
        const core: Core = new Core(players, storage, items, gameLoop, testConfig);
        return {items, players, storage, gameLoop, core};
    }

    it("Give invalid item throws", async () => {
        const context = setup();
        const player = new Player();
        context.players.connect(player);
        await assert.rejects(async () => context.core.giveItem(player.id, "testItem"));
    });

    it("Inventory shows new item", async () => {
        const context = setup();
        const player = new Player();
        context.players.connect(player);

        context.items.addItemType(new TestItemType("testItem", 5));
        await context.core.giveItem(player.id, "testItem", 3);
        const inventory = await context.core.getInventory(player.id);
        assert.ok(inventory[0]);
        assert.equal(inventory[0].amount, 3);

    });

    it("Used item shows in inventory", async () => {
        const context = setup();
        const player = new Player();
        context.players.connect(player);

        context.items.addItemType(new TestItemType("testItem", 5));
        await context.core.giveItem(player.id, "testItem", 1);
        const inventory = await context.core.getInventory(player.id);
        assert.ok(inventory[0]);
        await context.core.useItem(player.id, inventory[0].id);
        const newInventory = await context.core.getInventory(player.id);
        assert.equal(newInventory.length, 0);
    });

    it("Item transfer via ground between players", async () => {
        const context = setup();
        const player = new Player();
        player.pos = {x: 1, y: 1};

        context.players.connect(player);
        const player2 = new Player();
        player2.pos = {x: 1, y: 1};
        context.players.connect(player2);

        context.items.addItemType(new TestItemType("testItem", 5));
        await context.core.giveItem(player.id, "testItem", 3);
        const inventory = await context.core.getInventory(player.id);
        assert.ok(inventory[0]);
        await context.core.dropItem(player.id, inventory[0].id);
        const inventoryAfterDrop = await context.core.getInventory(player.id);
        assert.equal(inventoryAfterDrop.length, 0);
        const groundItemIds = await context.storage.getGroundItemsInRange({x: 1, y: 1}, testConfig.pickupRadius);
        assert.ok(groundItemIds[0]);
        const res = await context.core.pickupItem(player2.id, groundItemIds[0].id);
        assert.ok(res.ok);
        const inventory2 = await context.core.getInventory(player2.id);
        assert.ok(inventory2[0])
        assert.equal(inventory2[0].amount, 3);
        const groundItemIdsAfterPickup = await context.storage.getGroundItemsInRange({
            x: 1,
            y: 1
        }, testConfig.pickupRadius);
        assert.equal(groundItemIdsAfterPickup.length, 0);
    })

    it("Cannot pickup from far away", async () => {
        const context = setup();
        const player = new Player();
        player.pos = {x: 1, y: 1};

        context.players.connect(player);
        context.items.addItemType(new TestItemType("testItem", 5));

        const item: IItemInstance = {id: randomUUID(), typeId: "testItem", amount: 1};
        await context.storage.addGroundItem(item, {x: 1, y: 1}, 0);

        const groundItemIds = await context.storage.getGroundItemsInRange({x: 1, y: 1}, testConfig.pickupRadius);
        assert.ok(groundItemIds[0]);
        player.move({x: testConfig.pickupRadius, y: testConfig.pickupRadius});
        const result = await context.core.pickupItem(player.id, groundItemIds[0].id);
        assert.equal(result.ok, false);
        const groundItemIdsAfter = await context.storage.getGroundItemsInRange({x: 1, y: 1}, testConfig.pickupRadius);
        assert.ok(groundItemIdsAfter[0]);
    })

    it("Items disappear after its lifetime ends", async () => {
        const context = setup();
        context.items.addItemType(new TestItemType("testItem", 5));
        const item: IItemInstance = {id: randomUUID(), typeId: "testItem", amount: 1};
        await context.storage.addGroundItem(item, {x: 1, y: 1}, 0);

        context.gameLoop.tick += testConfig.itemLifetimeTicks;
        await context.core.clearOldItems();
        const beforeItems = await context.storage.getGroundItemsInRange({x: 1, y: 1}, testConfig.pickupRadius);
        assert.equal(beforeItems.length, 1);

        context.gameLoop.tick++;
        await context.core.clearOldItems();
        const afterItems = await context.storage.getGroundItemsInRange({x: 1, y: 1}, testConfig.pickupRadius);
        assert.equal(afterItems.length, 0);
    })

    it("Concurrent pickup doesn't create copy of an item", async () => {
        const context = setup(20);
        context.items.addItemType(new TestItemType("testItem", 5));
        const item: IItemInstance = {id: randomUUID(), typeId: "testItem", amount: 1};
        await context.storage.addGroundItem(item, {x: 1, y: 1}, 0);

        const player1 = new Player();
        const player2 = new Player();
        context.players.connect(player1);
        context.players.connect(player2);

        await Promise.all([
            context.core.pickupItem(player1.id, item.id),
            context.core.pickupItem(player2.id, item.id)]
        );


        const groundItems = await context.storage.getGroundItemsInRange({x: 1, y: 1}, testConfig.pickupRadius);
        assert.equal(groundItems.length, 0);
        const inventories = [await context.storage.getInventory(player1.id), await context.storage.getInventory(player2.id)];

        assert.equal(inventories.filter(i => i.length == 0).length, 1);
        assert.equal(inventories.filter(i => i.length == 1).length, 1);
    })

    it("Two identical useItem calls only one proceeds", async () => {
        const context = setup(20);
        context.items.addItemType(new Add1AmmoItemType("ammo1", 5));
        const player1 = new Player();
        context.players.connect(player1);
        await context.core.giveItem(player1.id, "ammo1");
        const inventory = await context.storage.getInventory(player1.id);
        assert.ok(inventory[0]);

        const all = await Promise.allSettled([
            context.core.useItem(player1.id, inventory[0].id),
            context.core.useItem(player1.id, inventory[0].id)]
        );
        assert.equal(all.filter(i => i.status == "fulfilled").length, 1);
        assert.equal(all.filter(i => i.status == "rejected").length, 1);
        assert.equal(player1.ammo, 1);
    })

    it("Use unusable item doesn't waste it", async () => {
        const context = setup();
        context.items.addItemType(new TestItemType("testItem", 5, false));
        const player1 = new Player();
        context.players.connect(player1);
        await context.core.giveItem(player1.id, "testItem");
        const inventory = await context.storage.getInventory(player1.id);
        assert.ok(inventory[0]);
        const res = await context.core.useItem(player1.id, inventory[0].id);
        assert.equal(res.ok, false);
        const inventoryAfter = await context.storage.getInventory(player1.id);
        assert.equal(inventoryAfter.length, 1);
    });

    it("Usable item affect player", async () => {
        const context = setup();
        context.items.addItemType(new Add1AmmoItemType("add1Ammo", 5));
        const player1 = new Player();
        context.players.connect(player1);
        await context.core.giveItem(player1.id, "add1Ammo");
        const inventory = await context.storage.getInventory(player1.id);
        assert.ok(inventory[0]);
        const res = await context.core.useItem(player1.id, inventory[0].id);
        assert.equal(res.ok, true);
        const inventoryAfter = await context.storage.getInventory(player1.id);
        assert.equal(inventoryAfter.length, 0);
        assert.equal(player1.ammo, 1);
    });

    it("On drop calls", async () => {
        class DropItemType extends ItemType {
            public isDropped: boolean = false;

            constructor(typeId: string, maxStack: number) {
                super(typeId, maxStack);
            }

            onDrop(player: Player) {
                super.onDrop(player);
                this.isDropped = true;
            }
        }

        const context = setup();
        const dropItem = new DropItemType("drop", 1);
        context.items.addItemType(dropItem);
        const player1 = new Player();
        context.players.connect(player1);
        await context.core.giveItem(player1.id, "drop");
        const inventory = await context.storage.getInventory(player1.id);
        assert.ok(inventory[0]);
        await context.core.dropItem(player1.id, inventory[0].id);
        assert.equal(dropItem.isDropped, true);
    });

    it("On pickup calls", async () => {
        class PickItemType extends ItemType {
            public isPicked: boolean = false;

            constructor(typeId: string, maxStack: number) {
                super(typeId, maxStack);
            }

            onPickup(player: Player) {
                super.onPickup(player);
                this.isPicked = true;
            }
        }

        const context = setup();
        const dropItem = new PickItemType("pick", 1);
        context.items.addItemType(dropItem);
        const player1 = new Player();
        context.players.connect(player1);
        const item: IItemInstance = {id: randomUUID(), typeId: "pick", amount: 1};
        await context.storage.addGroundItem(item, {x: 1, y: 1}, 0);
        player1.pos = {x: 1, y: 1};
        await context.core.pickupItem(player1.id, item.id);
        assert.equal(dropItem.isPicked, true);
    });

});