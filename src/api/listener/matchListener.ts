import {Container, Inject, Service} from "typedi";
import {IServerPing} from "../../interfaces/IServer";
import {RedisMessenger} from "../../messager/RedisMessenger";
import {ServerPingService} from "../../services/server/serverPingService";
import {Logger} from "winston";
import MatchService from "../../services/matchService";
import {
    IDisqualify,
    IPendingAssignMessage,
    IPendingUnAssignMessage, IPrivatization,
    ISpectatorAssignMessage,
    ITeamAssignMessage, IWinners
} from "../../interfaces/IMatch";

@Service()
export class MatchListener {

    constructor(
        private redisMessenger: RedisMessenger,
        private matchService: MatchService,
        @Inject('logger') private logger : Logger
    ) {
        this.matchService = Container.get(MatchService);
    }

    public assignSpectator(): void {
        this.redisMessenger.registerListener("gc-assign-spectator", async (message: ISpectatorAssignMessage) => {
            try {
                await this.matchService.assignSpectator(message.user, message.match, message.join);
            } catch (e) {
                this.logger.error('Error while assigning match spectators: %o', e);
            }
        });
    }

    public assignTeams(): void {
        this.redisMessenger.registerListener("gc-assign-teams", async (message: ITeamAssignMessage) => {
            try {
                await this.matchService.assignMatchTeams(message.teams, message.match);
            } catch (e) {
                this.logger.error('Error while assigning match teams %o', e);
            }
        });
    }

    public unAssignPending(): void {
        this.redisMessenger.registerListener("gc-pending-unassign", async (message: IPendingUnAssignMessage) => {
            try {
                await this.matchService.unAssignPending(message.user, message.match);
            } catch (e) {
                this.logger.error('Error while unassigning pending %o', e);
            }
        });
    }

    public assignPending(): void {
        this.redisMessenger.registerListener("gc-pending-assign", async (message: IPendingAssignMessage) => {
            try {
                console.log(this.matchService);
                await this.matchService.assignPending(message.assignable, message.match);
            } catch (e) {
                this.logger.error('Error while assigning pending %o', e);
            }
        });
    }

    public assignVictory(): void {
        this.redisMessenger.registerListener("gc-victory-assign", async (message: IWinners) => {
            try {
                await this.matchService.validateWinners(message.match, message.winners);
            } catch (e) {
                this.logger.error('Error while assigning victory %o', e);
            }
        });
    }

    public disqualify(): void {
        this.redisMessenger.registerListener("gc-disqualify", async (message: IDisqualify) => {
            try {
                await this.matchService.disqualify(message.user, message.match);
            } catch (e) {
                this.logger.error('Error while disquialifying match %o', e);
            }
        });
    }

    public privatization(): void {
        this.redisMessenger.registerListener("gc-privatization", async (message: IPrivatization) => {
            try {
                await this.matchService.privatize(message.requester, message.match);
            } catch (e) {
                this.logger.error('Error while privatizing match %o', e);
            }
        });
    }

    public registerListener(): void {
        this.assignSpectator();
        this.assignTeams();
        this.unAssignPending();
        this.assignPending();
        this.disqualify();
        this.privatization();
        this.assignVictory();
    }

}
