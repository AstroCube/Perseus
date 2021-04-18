import {Inject, Service} from "typedi";
import {Action, IServerPing} from "../../interfaces/IServer";
import {RedisMessenger} from "../../messager/RedisMessenger";
import {AlivePingService} from "../../services/alivePingService";
import {Logger} from "winston";

@Service()
export class ServerListener {

    constructor(
        private redisMessenger: RedisMessenger,
        @Inject('logger') private logger : Logger,
        private serverPingService: AlivePingService
    ) {}

    public registerPing(): void {
        this.redisMessenger.registerListener("serveralivemessage", async (message : IServerPing) => {
            try {
                if (message.action === Action.Confirm) {
                    await this.serverPingService.removeCheck(message.server, "scheduledPing");
                }
            } catch (e) {
                this.logger.error('Error while marking pinging of server %o', e);
            }
        });
    }

    public registerListener(): void {
        this.registerPing();
    }

}
