import {Inject, Service} from "typedi";
import {IServerPing} from "../../interfaces/IServer";
import {RedisMessenger} from "../../messager/RedisMessenger";
import {ServerPingService} from "../../services/server/serverPingService";
import {Logger} from "winston";
import MatchService from "../../services/matchService";
import {ISpectatorAssignMessage} from "../../interfaces/IMatch";

@Service()
export class ServerListener {

    constructor(
        private redisMessenger: RedisMessenger,
        @Inject('logger') private logger : Logger,
        private matchService: MatchService
    ) {}

    public assignSpectator(): void {
        this.redisMessenger.registerListener("gc-assign-spectator", async (message: ISpectatorAssignMessage) => {
            try {
                await this.matchService.assignSpectator(message.user, message.match, message.join);
            } catch (e) {
                this.logger.error('Error while marking pinging of server %o', e);
            }
        });
    }

    public registerListener(): void {
        this.assignSpectator();
    }

}
