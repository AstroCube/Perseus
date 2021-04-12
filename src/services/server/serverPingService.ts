import {Inject, Service} from "typedi";
import {RedisClient} from "redis";

@Service()
export class ServerPingService {

    constructor(
        @Inject("redis") private redis: RedisClient
    ) {
    }

    public scheduleCheck(id: string): void {
        const ping: number = this.getActualTries(id);
        this.redis.set("scheduledPing:" + id, (ping + 1) + "");
    }

    public getActualTries(id: string): number {
        return parseInt(String(this.redis.get("scheduledPing:" + id))) || 0;
    }

    public removeCheck(id: string): void {
        this.redis.del("scheduledPing:" + id);
    }

    public clearList(): void {
        this.redis.keys("scheduledPing:*", (err, reply) => {
            if (!err) {
                reply.forEach(key => this.redis.del(key));
            }
        });
    }

}
