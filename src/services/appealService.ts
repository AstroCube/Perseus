import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IAppeal, IAppealAction, IAppealActionType, IAppealCreation} from "../interfaces/IAppeal";
import {IUser} from "../interfaces/IUser";
import {IAppealPermissible, IAppealsPermissions} from "../interfaces/permissions/IAppealsPermissions";
import PunishmentService from "./punishmentService";
import {IPunishment} from "../interfaces/IPunishment";
import {ResponseError} from "../interfaces/error/ResponseError";
import dotty = require('dotty');

@Service()
export default class AppealService {

    constructor(
        @Inject('appealModel') private appealModel : Models.AppealModel,
        @Inject('logger') private logger: Logger,
        private punishmentService: PunishmentService
    ) {}

    public async createAppeal(body: IAppealCreation, requester: IUser): Promise<IAppeal> {
        try {

            //@ts-ignore
            const existingAppeal: IAppeal = await this.appealModel.findOne({punishment: body.punishment});
            if (existingAppeal) throw new ResponseError("The punishment was already appealed", 400);

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
                    createdAt: new Date(),
                    content: body.comment
                },
                requester
                );
        } catch (e) {
            this.logger.error('There was an error creating an appeal: %o', e);
            throw e;
        }
    }

    public async getAppeal(id: string, user: IUser): Promise<IAppeal> {
        try {
            const manifest = await this.getAppealPermissions(user);
            const appeal: IAppeal = await this.appealModel.findById(id);

            if (!manifest.manage && manifest.view !== IAppealPermissible.All) {
                if ((appeal.supervisor && appeal.supervisor._id.toString() !== user._id.toString()))
                    throw new ResponseError("You do not have permission to watch this appeal", 403);
                if (
                    (
                        (appeal.punishment.punished._id.toString() !== user._id.toString() &&
                            appeal.punishment.issuer._id.toString() !== user._id.toString())
                    )
                ) throw new ResponseError("You do not have permission to watch this appeal", 403);
            }

            return appeal;
        } catch (e) {
            this.logger.error('There was an error obtaining an appeal: %o',e);
            throw e;
        }
    }

    public async listAppeals(query: any, page: number, perPage: number, user: IUser, own?: boolean): Promise<IPaginateResult<IAppeal>> {
        try {
            const manifest = await this.getAppealPermissions(user);
            let encapsulation = null;
            if (manifest.view === IAppealPermissible.Own) encapsulation = {punished: user._id, appealed: true};
            if (manifest.view === IAppealPermissible.Involved) encapsulation =
                {$or: [{punished: user._id, appealed: true}, {issuer: user._id, appealed: true}]};

            if (encapsulation !== null || own) {
                let punishments: IPaginateResult<IPunishment> = await this.punishmentService.listPunishments(encapsulation, undefined, perPage);
                let punishmentIds = await punishments.data.map(p => p._id);
                if (own) await this.appealModel.paginate({...query, punishment: {$in: punishmentIds}}, {page, perPage});
                return await this.appealModel.paginate({...query, $or: [{punishment: {$in: punishmentIds}}, {supervisor: user._id}]}, {page, perPage});
            }

            return await this.appealModel.paginate(query, {page, perPage});
        } catch (e) {
            this.logger.error('There was an error listing an appeal %o',e);
            throw e;
        }
    }

    public async generateAction(id: string, action: IAppealAction, user: IUser): Promise<IAppeal> {
        let appeal = await this.appealModel.findById(id);
        const manifest = await this.getAppealPermissions(user);
        switch (action.type) {
            case IAppealActionType.Open: {
                if (!appeal.closed) throw new ResponseError("Already opened appeal", 400);
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.close', true);
                appeal.closed = false;
                break;
            }
            case IAppealActionType.Close: {
                if (appeal.closed) throw new ResponseError("Already closed appeal", 400);
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.close', true);
                appeal.closed = true;
                break;
            }
            case IAppealActionType.Lock: {
                if (appeal.locked) throw new ResponseError("Already locked appeal", 400);
                if (!manifest.manage && !manifest.transactional.lock) throw new ResponseError("You are not allowed to lock an appeal", 403);
                appeal.locked = true;
                break;
            }
            case IAppealActionType.Unlock: {
                if (!appeal.locked) throw new ResponseError("Already unlocked appeal", 400);
                if (!manifest.manage && !manifest.transactional.lock) throw new ResponseError("You are not allowed to lock an appeal", 403);
                appeal.locked = false;
                break;
            }
            case IAppealActionType.Escalate: {
                if (appeal.escalated) throw new ResponseError("Already escalated appeal", 400);
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.escalate', false);
                appeal.escalated = true;
                break;
            }
            case IAppealActionType.Appeal: {
                if (appeal.appealed) throw new ResponseError("Already appealed this reference", 400);
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.appeal', true);
                appeal.appealed = true;
                await this.punishmentService.updatePunishment({_id: appeal.punishment._id, active: false} as IPunishment);
                break;
            }
            case IAppealActionType.UnAppeal: {
                if (!appeal.appealed) throw new ResponseError("Already UnAppealed", 400);
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.appeal', true);
                appeal.appealed = false;
                await this.punishmentService.updatePunishment({_id: appeal.punishment._id, active: true} as IPunishment);
                break;
            }
            case IAppealActionType.Supervised: {
                if (!appeal.escalated) throw new ResponseError("This appeal was not escalated", 400);
                if (appeal.supervisor) throw new ResponseError("Already supervised this appeal", 400);
                if (!manifest.assign_escalated) throw new ResponseError("You are not allowed to supervise", 403);
                // @ts-ignore
                appeal.supervisor = action.user._id;
                break;
            }
            case IAppealActionType.Create: {
                if (appeal.punishment.appealed) throw new ResponseError("Already created", 400);
                if (appeal.punishment.punished._id === user._id) throw new ResponseError("You are not allowed to appeal this punishment", 403);
                await this.punishmentService.updatePunishment({_id: appeal.punishment._id, appealed: true} as IPunishment);
                break;
            }
            default: {
                if  (appeal.closed) throw new ResponseError("Can not comment while closed", 400);
                break;
            }
        }

        appeal.actions.push(action);
        return await appeal.save();
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

            manifest = await this.transactionalPermissions(manifest, user, IAppealPermissible.Involved);
            manifest = await this.transactionalPermissions(manifest, user, IAppealPermissible.All);
            return manifest;
        } catch (e) {
            this.logger.error('There was an error obtaining the permissible manifest: %o', e);
            throw e;
        }
    }

    private transactionalPermissions(manifest: IAppealsPermissions, user: IUser, type: IAppealPermissible): IAppealsPermissions {
        const manage = user.groups.some(g => g.group.web_permissions.appeals.manage);
        dotty.deepKeys(manifest, {leavesOnly: true}).forEach((key) => {
            if (typeof dotty.get(manifest, key) === "boolean") {
                if (manage || user.groups.some(g => dotty.exists(g.group.web_permissions.appeals, key) &&
                    dotty.get(g.group.web_permissions.appeals, key))) {
                    dotty.put(manifest, key, true);
                }
            } else {
                if (manage || user.groups.some(g => dotty.exists(g.group.web_permissions.appeals, key) &&
                    dotty.get(g.group.web_permissions.appeals, key) === type)) {
                    dotty.put(manifest, key, type);
                }
            }
        });

        return manifest;
    }

    private static moderationPermissionChecking(appeal: IAppeal, manifest: IAppealsPermissions, user: IUser, permission: string, moderate?: boolean): void {
        if (!(
            (manifest.manage || dotty.get(manifest, permission) === IAppealPermissible.All) ||
            (
                moderate &&
                (
                    dotty.get(manifest, permission) === IAppealPermissible.Involved &&
                    (
                        appeal.punishment.issuer._id.toString() === user._id.toString() ||
                        (appeal.supervisor && appeal.supervisor._id.toString() === user._id.toString())
                    )
                )
            ) ||
            (
                (
                    (
                        dotty.get(manifest, permission) === IAppealPermissible.Involved ||
                        dotty.get(manifest, permission) === IAppealPermissible.Own
                    ) &&
                    (
                        appeal.punishment.issuer._id.toString() === user._id.toString() ||
                        appeal.punishment.punished._id.toString() === user._id.toString() ||
                        (appeal.supervisor && appeal.supervisor._id.toString() === user._id.toString())
                    )
                )
            )
        )
        ) throw new ResponseError("You can not execute the action over this appeal", 403);
    }

}
