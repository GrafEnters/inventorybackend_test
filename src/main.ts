import {GameLoop} from "./gameloop.js";
import {ItemTypeRegistry} from "./items/itemTypeRegistry.js";
import {Medkit} from "./items/medkit.js";
import {PlayerRegistry} from "./playerRegistry.js";
import {AsyncStorage} from "./asyncStorage.js";
import {Core} from "./core.js";
import type {GameConfig} from "./config.js";
import type {Player} from "./player.js";
import {Armor} from "./items/armor.js";
import {Ammo} from "./items/ammo.js";
import {Bandage} from "./items/bandage.js";
import {DemoScenario} from "./demoScenario.js";

const tickIntervalInSeconds = 1;
const gameLoop = new GameLoop(tickIntervalInSeconds);


const itemTypes = new ItemTypeRegistry();
itemTypes.addItemType(new Medkit("medkit", 10, 75));
itemTypes.addItemType(new Armor("armor", 10, 60));
itemTypes.addItemType(new Ammo("ammo", 30, 90));
itemTypes.addItemType(new Bandage("bandage", 10, 2, 15));

const players = new PlayerRegistry();
const storage = new AsyncStorage(100, 200);
const config: GameConfig = {pickupRadius: 5, itemLifetimeTicks: 20};
const core: Core = new Core(players, storage, itemTypes, gameLoop, config);

gameLoop.subscribe(tick => {
    let log = `Tick: ${tick}`;
    players.getAll().forEach((player: Player) => {
        player.tickAllEffects();
    })
    core.clearOldItems()
        .catch((err) => log += `\n Error: ${err.message}`)
        .finally(() => console.log(log));

})
gameLoop.start();


// ===== Демо-сценарий =====

const scenario = new DemoScenario(core, players, storage, gameLoop, config);
try {
    await scenario.run();
    console.log("Сценарий завершён");
} catch (error) {
    console.error("Сценарий упал:", error);
} finally {
    gameLoop.stop();
}