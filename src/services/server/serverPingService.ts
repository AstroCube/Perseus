import {Inject, Service} from "typedi";
import {RedisClient} from "redis";
import RedisService from "../redisService";

@Service()
export class ServerPingService {

    constructor(
        private redisService: RedisService
    ) {
    }

    public async scheduleCheck(id: string): Promise<void> {
        const ping: number = await this.getActualTries(id);
        await this.redisService.setKey("scheduledPing:" + id, (ping + 1) + "");
    }

    public async getActualTries(id: string): Promise<number> {
        return parseInt(String(await this.redisService.getKey("scheduledPing:" + id))) || 0;
    }

    public async removeCheck(id: string): Promise<void> {
        await this.redisService.deleteKey("scheduledPing:" + id);
    }

    public async removeUnused(compare: string[]): Promise<void> {
        (await this.redisService.getKeySet("scheduledPing:*")).forEach(key => {
           if (!compare.includes(key)) {
               this.redisService.deleteKey(key);
           }
        });
    }

}
