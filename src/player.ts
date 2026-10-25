import type {Pos} from "./pos.js";
import {randomUUID, type UUID} from "node:crypto";
import {NumberInRange} from "./numberInRange.js";
import type {EffectOverTime} from "./effectOverTime.js";

export class Player {
    public readonly id: UUID;
    private _pos: Pos = {x: 0, y: 0};
    private _health = new NumberInRange(0, 100, 100);
    private _armor = new NumberInRange(0, 100, 100);
    private _ammo  = new NumberInRange(0, 99999, 0);

    private readonly _effects: Map<string, EffectOverTime> = new Map();

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
            this._ammo = new NumberInRange(0, 99999, ammo);
        }

    }

    addEffect(effectId: string, effect: EffectOverTime, refill: boolean = false): boolean {
        if (this._effects.has(effectId) && !refill) {
            return false;
        }
        this._effects.set(effectId, effect);
        return true;
    }

    tickAllEffects(): void {
        for (const effectId of this._effects.keys()) {
            const effect = this._effects.get(effectId)!;
            effect.tickEffect(this);
            if (effect.remainingTicks <= 0) {
                this._effects.delete(effectId);
            }
        }
    }

    get health(): number {
        return this._health.value;
    }

    get maxHealth(): number {
        return this._health.max;
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
        return this._ammo.value;
    }

    changeHealth(delta: number): void {
        this._health.value += delta;
    }

    changeArmor(delta: number): void {
        this._armor.value += delta;
    }

    changeAmmo(delta: number): void {
        if (!Number.isInteger(delta)) {
            throw new RangeError("Delta must be an integer");
        }
        this._ammo.value += delta;
    }

    set pos(value: Pos) {
        this._pos = {...value};
    }

    move(delta: Pos) {
        this._pos.x += delta.x;
        this._pos.y += delta.y;
    }

}