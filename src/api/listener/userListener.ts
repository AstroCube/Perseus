import {Container, Inject, Service} from "typedi";
import {IServerPing} from "../../interfaces/IServer";
import {RedisMessenger} from "../../messager/RedisMessenger";
import {AlivePingService} from "../../services/alivePingService";
import {Logger} from "winston";
import {ISessionPing} from "../../interfaces/ISession";
import SessionService from "../../services/sessionService";

@Service()
export class UserListener {

    constructor(
        private redisMessenger: RedisMessenger,
        private alivePingService: AlivePingService,
        @Inject('logger') private logger : Logger
    ) {}

    public registerPing(): void {
        this.redisMessenger.registerListener("session-user-pingback", async (message : ISessionPing) => {
            try {
                await this.alivePingService.removeCheck(message.user, "scheduledUserPing");
            } catch (e) {
                this.logger.error('Error while marking pinging of user %o', e);
            }
        });
    }

    public registerListener(): void {
        this.registerPing();
    }

}
