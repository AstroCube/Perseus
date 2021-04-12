import {Inject, Service} from "typedi";
import {RedisClient} from "redis";
import config from '../config';
import {Message} from "./Metadata";
import {Listener} from "./Listener";

@Service()
export class RedisMessenger {

    private listeners : Listener[] = [];

    constructor(
        @Inject("redis") private redis: RedisClient
    ) {

        this.redis.on("message", (channel, message : any) => {
            console.log(message);
            const messageCompound: Message<any> = JSON.parse(message);

            this.listeners.forEach(listener => {
                if (listener.name === messageCompound.metadata.appId) {
                    listener.action(messageCompound.message);
                }
            });

        });

        this.redis.subscribe(config.redis.subscriber);

    }

    public registerListener(name: string, action: (message : any) => void): void {
        this.listeners.push({name, action} as Listener);
    }

    public sendMessage<T>(name: string, message: T): void {

        const completeMessage: Message<T> = {
            metadata: {
                headers: [],
                appId: name,
                messageId: this.createUUID(),
                instanceId: "perseus",
                timestamp: new Date()
            },
            message
        };

        this.redis.publish(config.redis.subscriber, JSON.stringify(completeMessage));
    }

    private createUUID() {
        let dt = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = (dt + Math.random()*16) % 16 | 0;
            dt = Math.floor(dt/16);
            return (c=='x' ? r :(r &0x3|0x8)).toString(16);
        });
        return uuid;
    }




}
