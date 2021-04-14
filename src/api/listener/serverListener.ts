import {Inject, Service} from "typedi";
import {IServerPing} from "../../interfaces/IServer";
import {RedisMessenger} from "../../messager/RedisMessenger";
import {ServerPingService} from "../../services/server/serverPingService";
import {Logger} from "winston";

@Service()
export class ServerListener {

    constructor(
        private redisMessenger: RedisMessenger,
        @Inject('logger') private logger : Logger,
        private serverPingService: ServerPingService
    ) {}

    public registerPing(): void {
        this.redisMessenger.registerListener("serveralivemessage", async (message) => {
            try {
                const ping : IServerPing = message;
                await this.serverPingService.removeCheck(ping.server);
            } catch (e) {
                this.logger.error('Error while marking pinging of server %o', e);
            }
        });
    }

    public registerListener(): void {
        this.registerPing();
    }

}
