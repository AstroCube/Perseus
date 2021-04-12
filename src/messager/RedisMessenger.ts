import {Inject, Service} from "typedi";
import {RedisClient} from "redis";
import config from '../config';
import {Message} from "./Metadata";
import {Listener} from "./Listener";
import {Logger} from "winston";

@Service()
export class RedisMessenger {

    private listeners : Listener[] = [];
    private id: string;

    constructor(
        @Inject("redis-subscriber") private redisSubscriber: RedisClient,
        @Inject("redis-publisher") private redisPublisher: RedisClient,
        @Inject('logger') private logger : Logger
    ) {
        this.redisSubscriber.on("message", (channel, message : any) => {
            const messageCompound: Message<any> = JSON.parse(message);

            this.listeners.forEach(listener => {
                if (listener.name === messageCompound.metadata.appId && listener.name !== this.id) {
                    listener.action(messageCompound.message);
                }
            });

        });

        this.redisSubscriber.subscribe(config.redis.subscriber);
        this.id = "perseus_" + this.createUUID();
    }

    public registerListener(name: string, action: (message : any) => void): void {
        this.listeners.push({name, action} as Listener);
    }

    public async sendMessage<T>(name: string, message: T): Promise<void> {

        try {
            const completeMessage: Message<T> = {
                metadata: {
                    headers: [],
                    appId: name,
                    messageId: this.createUUID(),
                    instanceId: this.id,
                    timestamp: new Date()
                },
                message
            };

            this.redisPublisher.publish(config.redis.subscriber, JSON.stringify(completeMessage));
        } catch (e) {
            this.logger.error('Error while sending message %o', e);
            throw e;
        }
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
