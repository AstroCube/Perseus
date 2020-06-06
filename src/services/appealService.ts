import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IAppeal, IAppealAction, IAppealActionType, IAppealCreation} from "../interfaces/IAppeal";
import {IUser} from "../interfaces/IUser";
import {IAppealPermissible, IAppealsPermissions} from "../interfaces/permissions/IAppealsPermissions";
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

            const existingAppeal: IAppeal = await this.appealModel.findOne({punishment: body.punishment});
            if (existingAppeal) throw new Error("Already Appealed");

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

    public async listAppeals(query: any, page: number, perPage: number, user: IUser): Promise<IPaginateResult<IAppeal>> {
        try {
            const manifest = await this.getAppealPermissions(user);
            //if (manifest.view === IAppealPermissible.Own)

            return this.appealModel.paginate(query, {page, perPage});
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
                case IAppealActionType.Create: {
                    appeal.punishment.appealed = true;
                    await this.punishmentService.updatePunishment(appeal.punishment);
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

    public async getAppealPermissions(user: IUser): Promise<IAppealsPermissions> {
        try {
            let manifest = {
                manage: false,
                transactional: {
                    comment: IAppealPermissible.Own,
                    close: IAppealPermissible.None,
                    lock: false,
                    escalate: IAppealPermissible.Own,
                    appeal: IAppealPermissible.None,
                },
                assign_escalated: false,
                view: IAppealPermissible.None
            };

            manifest = this.transactionalPermissions(manifest, user, IAppealPermissible.Involved);
            manifest = this.transactionalPermissions(manifest, user, IAppealPermissible.All);
            return manifest;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    private transactionalPermissions(manifest: IAppealsPermissions, user: IUser, type: IAppealPermissible): IAppealsPermissions {
        const manage = user.groups.some(g => g.group.web_permissions.appeals.manage === true);
        Object.keys(manifest).forEach((key, index) => {
            if (typeof manifest[key] === "boolean" &&
                (user.groups.some(g => g.group.web_permissions.appeals[key] === true || manage))
            ) manifest[key] = true;

            if (manage) manifest[key] = IAppealPermissible.All;
            else if (user.groups.some(g => g.group.web_permissions.appeals[key] === type)) manifest[key] = type;
        });
        return manifest;
    }

}
