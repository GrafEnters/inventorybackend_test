export class NumberInRange {

    private _value!: number;

    private readonly _min: number;
    private readonly _max: number;

    public constructor(min: number, max: number, defaultValue: number) {
        this._min = min;
        this._max = max;
        if (min >= max) {
            throw new Error(`Min value ${min} must be lower than max ${max}`);
        }
        this.value = defaultValue;
    }

    get value(): number {
        return this._value;
    }

    set value(value: number) {
        if (Number.isNaN(value)) {
            throw new Error(`Value cannot be NaN`);
        }
        this._value = NumberInRange.clamp(value, this._min, this._max);
    }

    public static clamp(value: number, min: number, max: number): number {
        return Math.max(Math.min(value, max), min);
    }
}