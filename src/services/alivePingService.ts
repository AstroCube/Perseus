import {Inject, Service} from "typedi";
import {RedisClient} from "redis";
import RedisService from "./redisService";

@Service()
export class AlivePingService {

    constructor(
        private redisService: RedisService
    ) {
    }

    public async scheduleCheck(id: string, tag: string): Promise<void> {
        const ping: number = await this.getActualTries(id, tag);
        await this.redisService.setKey(tag + ":" + id, (ping + 1) + "");
    }

    public async getActualTries(id: string, tag: string): Promise<number> {
        return parseInt(String(await this.redisService.getKey(tag + ":" + id))) || 0;
    }

    public async removeCheck(id: string, tag: string): Promise<void> {
        await this.redisService.deleteKey(tag + ":" + id);
    }

    public async removeUnused(compare: string[], tag: string): Promise<void> {
        (await this.redisService.getKeySet(tag + ":*")).forEach(key => {
           if (!compare.includes(key)) {
               this.redisService.deleteKey(key);
           }
        });
    }

}
