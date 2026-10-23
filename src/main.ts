import {GameLoop} from "./gameloop.js";

console.log("Hello World!");

const tickIntervalInSeconds = 1;

const gameLoop = new GameLoop(tickIntervalInSeconds);
gameLoop.start(t => {
    console.log(t);
});