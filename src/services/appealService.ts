import {Inject, Service} from "typedi";
import {IAppeal, IAppealAction, IAppealActionType, IAppealCreation} from "../interfaces/IAppeal";
import {Logger} from "winston";
import {IUser} from "../interfaces/IUser";
import PunishmentService from "./punishmentService";

@Service()
export default class AppealService {

    constructor(
        @Inject('appealModel') private appealModel : Models.AppealModel,
        @Inject('logger') private logger: Logger,
        private punishmentService: PunishmentService
    ) {}

    public async createAppeal(body: IAppealCreation, requester: IUser): Promise<IAppeal> {
        try {
            const appeal: IAppeal = await this.appealModel.create({
                //@ts-ignore
                punishment: body.punishment,
                registeredAddress: body.registeredAddress
            });

            return await this.generateAction(
                appeal._id,
                {
                    type: IAppealActionType.Create,
                    //@ts-ignore
                    user: requester._id,
                    createdAt: null,
                    content: body.comment
                });
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async getAppeal(id: string): Promise<IAppeal> {
        try {
            return this.appealModel.findById(id);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async listAppeals(query?: any): Promise<IAppeal[]> {
        try {
            return this.appealModel.find(query);
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async generateAction(id: string, action: IAppealAction): Promise<IAppeal> {
        try {
            let appeal = await this.appealModel.findById(id);

            switch (action.type) {
                case IAppealActionType.Open: {
                    appeal.closed = false;
                    break;
                }
                case IAppealActionType.Close: {
                    appeal.closed = true;
                    break;
                }
                case IAppealActionType.Lock: {
                    appeal.locked = true;
                    break;
                }
                case IAppealActionType.Unlock: {
                    appeal.locked = false;
                    break;
                }
                case IAppealActionType.Escalate: {
                    appeal.escalated = true;
                    break;
                }
                case IAppealActionType.Appeal: {
                    appeal.appealed = true;
                    appeal.punishment.active = false;
                    await this.punishmentService.updatePunishment(appeal.punishment);
                    break;
                }
                case IAppealActionType.UnAppeal: {
                    appeal.appealed = false;
                    appeal.punishment.active = true;
                    await this.punishmentService.updatePunishment(appeal.punishment);
                    break;
                }
                case IAppealActionType.Supervised: {
                    // @ts-ignore
                    appeal.supervisor = action.user._id;
                    break;
                }
                default: {
                    break;
                }
            }

            appeal.actions.push(action);
            return await appeal.save();
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

}
