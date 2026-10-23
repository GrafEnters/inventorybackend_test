import {GameLoop} from "./gameloop.js";
import {Player} from "./player.js";

const tickIntervalInSeconds = 1;
const gameLoop = new GameLoop(tickIntervalInSeconds);
gameLoop.start(t => {
    console.log(t);
});
const player = new Player();

player.changeHealth(50);
console.log('player ' + JSON.stringify(player));
console.log('player ' + player.health);
player.changeArmor(-150);
console.log('player ' + player.armor);