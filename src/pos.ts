export interface Pos {
    x: number,
    y: number;
}

export class PosMath{
    public static isNear(pos1: Pos, pos2: Pos, range: number): boolean {
        return Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) <= range * range;
    }
}