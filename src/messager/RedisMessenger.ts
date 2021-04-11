import {Inject, Service} from "typedi";
import {RedisClient} from "redis";
import config from '../config';
import {Message} from "./Metadata";

@Service()
export class RedisMessenger {

    constructor(
        @Inject("redis") private redis: RedisClient
    ) {

        this.redis.on("message", (channel, message : any) => {

            const messageCompound: Message<any> = message as Message<any>;

            console.log(message);

        });

        this.redis.subscribe(config.redis.subscriber);

    }

}
