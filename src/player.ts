import type {Pos} from "./pos.js";
import {randomUUID, type UUID} from "node:crypto";
import {NumberInRange} from "./numberInRange.js";

export class Player {
    public readonly id: UUID;
    private _pos: Pos = {x: 0, y: 0};
    private _health = new NumberInRange(0, 100, 100);
    private _armor = new NumberInRange(0, 100, 100);
    private _ammo: number = 0;

    constructor(id?: UUID, pos?: Pos, health?: number, armor?: number, ammo?: number) {
        if (id) {
            this.id = id;
        } else {
            this.id = randomUUID();
        }

        if (pos) {
            this._pos = {...pos};
        }
        if (health != null) {
            this._health = new NumberInRange(0, 100, health);
        }
        if (armor != null) {
            this._armor = new NumberInRange(0, 100, armor);
        }
        if (ammo != null) {
            this._ammo = ammo;
        }

    }

    get health(): number {
        return this._health.value;
    }

    get armor(): number {
        return this._armor.value;
    }
    get maxArmor(): number {
        return this._armor.max;
    }

    get pos(): Pos {
        return {...this._pos};
    }

    get ammo(): number {
        return this._ammo;
    }

    set ammo(value: number) {
        this._ammo = value;
    }

    changeHealth(delta: number): void {
        this._health.value += delta;
    }

    changeArmor(delta: number): void {
        this._armor.value += delta;
    }

    changeAmmo(delta: number): void {
        this._ammo += delta;
    }

    set pos(value: Pos) {
        this._pos = {...value};
    }

    move(delta: Pos) {
        this._pos.x += delta.x;
        this._pos.y += delta.y;
    }

}