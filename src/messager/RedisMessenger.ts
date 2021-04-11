import {Inject, Service} from "typedi";
import {RedisClient} from "redis";
import config from '../config';
import {Message} from "./Metadata";

@Service()
export class RedisMessenger {

    constructor(
        @Inject("redis") private redis: RedisClient
    ) {

        console.log("Added subscribe");

        this.redis.on("subscribe", function(channel, count) {
            console.log(channel);
        });


        this.redis.on("message", (channel, message : any) => {
            console.log(message);
            const messageCompound: Message<any> = message as Message<any>;
        });

        this.redis.subscribe(config.redis.subscriber);

    }

}
