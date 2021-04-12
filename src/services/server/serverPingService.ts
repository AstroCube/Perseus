import {Inject, Service} from "typedi";
import {RedisClient} from "redis";

@Service()
export class ServerPingService {

    constructor(
        @Inject("redis") private redis: RedisClient
    ) {
    }

    public scheduleCheck(id: string): void {
        this.redis.lpush("scheduledPing", id);
    }

    public removeCheck(id: string): void {
        this.redis.lrem("scheduledPing", 0, id);
    }

    public clearList(): void {
        this.redis.del("scheduledPing");
    }

}
