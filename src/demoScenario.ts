import type {UUID} from "node:crypto";
import type {Core} from "./core.js";
import type {PlayerRegistry} from "./playerRegistry.js";
import type {IStorage} from "./IStorage.js";
import type {GameLoop} from "./gameloop.js";
import type {GameConfig} from "./config.js";
import type {Result} from "./result.js";
import {Player} from "./player.js";

export class DemoScenario {
    private readonly _core: Core;
    private readonly _players: PlayerRegistry;
    private readonly _storage: IStorage;
    private readonly _gameLoop: GameLoop;
    private readonly _config: GameConfig;

    constructor(core: Core, players: PlayerRegistry, storage: IStorage, gameLoop: GameLoop, config: GameConfig) {
        this._core = core;
        this._players = players;
        this._storage = storage;
        this._gameLoop = gameLoop;
        this._config = config;
    }

    async run(): Promise<void> {
        const core = this._core;
        const tickMs = this._gameLoop.tickIntervalMilliseconds;

        // 1. Игроки
        const a = new Player();
        a.pos = {x: 0, y: 0};
        const b = new Player();
        b.pos = {x: 1, y: 1};
        this._players.connect(a);
        this._players.connect(b);
        console.log("[1] A (0, 0) и B (1, 1) подключились");

        // 2. Выдача
        await core.giveItem(a.id, "medkit", 2);
        await core.giveItem(a.id, "bandage", 1);
        await core.giveItem(a.id, "ammo", 1);
        console.log("[2] A получил 2 аптечки, бинт и пачку патронов");
        await this.logInventory("A", a.id);

        // 3. Аптечка
        a.changeHealth(-60);
        console.log(`[3] A получил урон, здоровье: ${a.health}`);
        const medkitId = await this.itemIdOf(a.id, "medkit");
        const firstMedkit = await core.useItem(a.id, medkitId);
        console.log(`  Первая аптечка: ${this.formatResult(firstMedkit)}, здоровье: ${a.health}`);
        const secondMedkit = await core.useItem(a.id, medkitId);
        console.log(`  Вторая аптечка: ${this.formatResult(secondMedkit)}, здоровье: ${a.health}`);
        await this.logInventory("A", a.id);

        // 4. Бинт: дальше здоровье растёт на тиках
        a.changeHealth(-15);
        const bandageResult = await core.useItem(a.id, await this.itemIdOf(a.id, "bandage"));
        console.log(`[4] A получил урон (здоровье ${a.health}) и использовал бинт: ${this.formatResult(bandageResult)}`);
        let lastHealth = a.health;
        const unsubscribeHealth = this._gameLoop.subscribe(() => {
            if (a.health !== lastHealth) {
                console.log(`  [бинт] здоровье A: ${lastHealth} -> ${a.health}`);
                lastHealth = a.health;
            }
            if (a.health === a.maxHealth) {
                unsubscribeHealth();
            }
        });
        await this.wait(tickMs * 3);

        // 5. drop -> pickup
        const ammoId = await this.itemIdOf(a.id, "ammo");
        await core.dropItem(a.id, ammoId);
        const ammoPickup = await core.pickupItem(b.id, ammoId);
        console.log(`[5] A выбросил патроны, B подобрал: ${this.formatResult(ammoPickup)}`);
        await this.logInventory("A", a.id);
        await this.logInventory("B", b.id);
        const ammoUse = await core.useItem(b.id, await this.itemIdOf(b.id, "ammo"));
        console.log(`  B использовал патроны: ${this.formatResult(ammoUse)}, патронов у B: ${b.ammo}`);

        // 6. Конкурентный подбор
        const medkitToDrop = await this.itemIdOf(a.id, "medkit");
        await core.dropItem(a.id, medkitToDrop);
        const [pickupA, pickupB] = await Promise.all([
            core.pickupItem(a.id, medkitToDrop),
            core.pickupItem(b.id, medkitToDrop),
        ]);
        console.log(`[6] A выбросил аптечку, одновременный подбор: A — ${this.formatResult(pickupA)}, B — ${this.formatResult(pickupB)}`);
        await this.logInventory("A", a.id);
        await this.logInventory("B", b.id);

        // 7. Таймаут
        await core.giveItem(a.id, "armor", 1);
        const armorId = await this.itemIdOf(a.id, "armor");
        await core.dropItem(a.id, armorId);
        a.move({x: 100, y: 100});
        const dropped = await this._storage.getGroundItem(armorId);
        const spawnTick = dropped?.spawnTick ?? this._gameLoop.tick;
        console.log(`[7] A выбросил броню на тике ${spawnTick} и ушёл. Время жизни: ${this._config.itemLifetimeTicks} тиков`);
        let lastLoggedTick = -1;
        while (await this._storage.getGroundItem(armorId) !== null) {
            const tick = this._gameLoop.tick;
            if (tick !== lastLoggedTick && (tick - spawnTick) % 10 === 0) {
                console.log(`  тик ${tick}: броня лежит на земле`);
                lastLoggedTick = tick;
            }
            await this.wait(tickMs / 2);
        }
        console.log(`  тик ${this._gameLoop.tick}: броня исчезла`);
    }

    private formatResult(result: Result): string {
        return result.ok ? "ok" : `отказ (${result.reason})`;
    }

    private async itemIdOf(playerId: UUID, typeId: string): Promise<UUID> {
        const item = (await this._core.getInventory(playerId)).find(i => i.typeId === typeId);
        if (item === undefined) {
            throw new Error(`No ${typeId} in inventory of ${playerId}`);
        }
        return item.id;
    }

    private async logInventory(name: string, playerId: UUID): Promise<void> {
        const inventory = await this._core.getInventory(playerId);
        const text = inventory.map(i => `${i.typeId} x${i.amount}`).join(", ") || "пусто";
        console.log(`  Инвентарь ${name}: ${text}`);
    }

    private wait(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}