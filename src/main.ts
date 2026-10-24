import {GameLoop} from "./gameloop.js";
import {ItemTypeRegistry} from "./items/itemTypeRegistry.js";
import {Medkit} from "./items/medkit.js";
import {PlayerRegistry} from "./playerRegistry.js";
import {AsyncStorage} from "./asyncStorage.js";
import {Core} from "./core.js";
import type {GameConfig} from "./config.js";

const tickIntervalInSeconds = 1;
const gameLoop = new GameLoop(tickIntervalInSeconds);


const itemTypes = new ItemTypeRegistry();
itemTypes.addItemType(new Medkit("medkit", 10, 75));

const players = new PlayerRegistry();
const storage = new AsyncStorage(100, 200);
const config: GameConfig = {pickupRadius: 5, itemLifetimeTicks: 60};
const core: Core = new Core(players, storage, itemTypes, gameLoop, config);

gameLoop.subscribe(tick => {
    let log = `Tick: ${tick}`;
    core.clearOldItems()
        .catch((err) => log += `\n Error: ${err.message}`)
        .finally(() => console.log(log));
})
gameLoop.start();