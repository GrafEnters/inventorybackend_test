export class PromiseQueue {
    private _last: Promise<unknown> = Promise.resolve();
    private _onQueueEnded: (() => void) | undefined;

    constructor(onQueueEnded?: () => void) {
        this._onQueueEnded = onQueueEnded;
    }

    public append<T>(func: () => Promise<T>): Promise<T> {
        const promise = this._last.then(() => func());
        const safe = promise.catch(() => undefined);
        this._last = safe;
        safe.then(() => {
            if (this._last === safe) {
                this._onQueueEnded?.();
            }
        });
        return promise;
    }

}