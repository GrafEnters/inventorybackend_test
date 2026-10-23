import {GameLoop} from "./gameloop.js";
import {Player} from "./player.js";
import {ItemTypeRegistry} from "./items/itemTypeRegistry.js";
import {Medkit} from "./items/medkit.js";

const tickIntervalInSeconds = 1;
const gameLoop = new GameLoop(tickIntervalInSeconds);


const itemTypes = new ItemTypeRegistry();
itemTypes.addItemType(new Medkit("medkit", 10, 75));


gameLoop.start(t => {
    console.log(t);
});