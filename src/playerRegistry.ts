import type {UUID} from "node:crypto";
import type {Player} from "./player.js";

export class PlayerRegistry {
    private readonly players: Map<UUID, Player> = new Map();

    public connect(player: Player): void {
        this.players.set(player.id, player);
    }

    public disconnect(playerId: UUID): void {
        this.players.delete(playerId);

    }

    public get(playerId: UUID): Player | undefined {
        return this.players.get(playerId);
    }
    public getAll(): Player[] {
        return this.players.values().toArray();
    }
}