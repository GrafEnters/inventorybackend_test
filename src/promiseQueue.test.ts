import {describe, it} from "node:test";
import {PromiseQueue} from "./promiseQueue.js";
import assert from "node:assert/strict";

describe("PromiseQueue", () => {
    it("Queue order works", async () => {
        const queue = new PromiseQueue();
        let str = "";
        const first = queue.append(() => new Promise<void>(resolve => {
            setTimeout(() => {
                str += "1";
                resolve();
            }, 10);
        }));
        await queue.append(() => new Promise<void>(resolve => {
            setTimeout(() => {
                str += "2";
                resolve();
            }, 0);
        }));
        assert.equal(str, "12");
        await first;
    });

    it("Failed promise keeps queue alive", async () => {
        const queue = new PromiseQueue();
        let str = "";
        const rejected = queue.append(() => new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                reject();
            }, 10);
        }));
        const second = queue.append(() => new Promise<void>(resolve => {
            setTimeout(() => {
                str += "2";
                resolve();
            }, 0);
        }));
        await assert.rejects(rejected);
        await second;
        assert.equal(str, "2");
    });
});