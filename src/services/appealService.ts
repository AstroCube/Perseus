import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IAppeal, IAppealAction, IAppealActionType, IAppealCreation} from "../interfaces/IAppeal";
import {IUser} from "../interfaces/IUser";
import {IAppealPermissible, IAppealsPermissions} from "../interfaces/permissions/IAppealsPermissions";
import PunishmentService from "./punishmentService";
import {IPunishment} from "../interfaces/IPunishment";
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
                    createdAt: new Date(),
                    content: body.comment
                },
                requester
                );
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async getAppeal(id: string, user: IUser): Promise<IAppeal> {
        try {
            const manifest = await this.getAppealPermissions(user);
            const appeal: IAppeal = await this.appealModel.findById(id);

            if ((appeal.supervisor && appeal.supervisor._id.toString() !== user._id.toString())) throw new Error("UnauthorizedError");
            if (
                (!manifest.manage && manifest.view !== IAppealPermissible.All) &&
                (
                    (appeal.punishment.punished._id.toString() !== user._id.toString() &&
                    appeal.punishment.issuer._id.toString() !== user._id.toString())
                )
            ) throw new Error("UnauthorizedError");

            return appeal;
        } catch (e) {
            this.logger.error(e);
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
                const punishments = await this.punishmentService.listPunishments(encapsulation, page, perPage);
                if (own) await this.appealModel.paginate({...query, punishment: {$in: punishments}}, {page, perPage});
                return await this.appealModel.paginate({...query, $or: [{punishment: {$in: punishments}}, {supervisor: user._id}]}, {page, perPage});
            }

            return await this.appealModel.paginate(query, {page, perPage});
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async generateAction(id: string, action: IAppealAction, user: IUser): Promise<IAppeal> {
        let appeal = await this.appealModel.findById(id);
        const manifest = await this.getAppealPermissions(user);
        let punishment = appeal.punishment;
        switch (action.type) {
            case IAppealActionType.Open: {
                if (!appeal.closed) throw new Error("Already opened");
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.close', true);
                appeal.closed = false;
                break;
            }
            case IAppealActionType.Close: {
                if (appeal.closed) throw new Error("Already closed");
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.close', true);
                appeal.closed = true;
                break;
            }
            case IAppealActionType.Lock: {
                if (appeal.locked) throw new Error("Already locked");
                if (!manifest.manage && !manifest.transactional.lock) throw new Error("UnauthorizedError");
                appeal.locked = true;
                break;
            }
            case IAppealActionType.Unlock: {
                if (!appeal.locked) throw new Error("Already unlocked");
                if (!manifest.manage && !manifest.transactional.lock) throw new Error("UnauthorizedError");
                appeal.locked = false;
                break;
            }
            case IAppealActionType.Escalate: {
                if (appeal.escalated) throw new Error("Already escalated");
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.escalate', false);
                appeal.escalated = true;
                break;
            }
            case IAppealActionType.Appeal: {
                if (appeal.appealed) throw new Error("Already appealed");
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.appeal', true);
                appeal.appealed = true;
                await this.punishmentService.updatePunishment({_id: appeal.punishment._id, active: false} as IPunishment);
                break;
            }
            case IAppealActionType.UnAppeal: {
                if (!appeal.appealed) throw new Error("Already UnAppealed");
                AppealService.moderationPermissionChecking(appeal, manifest, user, 'transactional.appeal', true);
                appeal.appealed = false;
                await this.punishmentService.updatePunishment({_id: appeal.punishment._id, active: true} as IPunishment);
                break;
            }
            case IAppealActionType.Supervised: {
                if (!appeal.escalated) throw new Error("Not escalated");
                if (appeal.supervisor) throw new Error("Already supervised");
                if (!manifest.assign_escalated) throw new Error("UnauthorizedError");
                // @ts-ignore
                appeal.supervisor = action.user._id;
                break;
            }
            case IAppealActionType.Create: {
                if (appeal.punishment.appealed) throw new Error("Already created");
                if (appeal.punishment.punished._id === user._id) throw new Error("UnauthorizedError");
                await this.punishmentService.updatePunishment({_id: appeal.punishment._id, appealed: true} as IPunishment);
                break;
            }
            default: {
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
            this.logger.error(e);
            throw e;
        }
    }

    private transactionalPermissions(manifest: IAppealsPermissions, user: IUser, type: IAppealPermissible): IAppealsPermissions {
        const manage = user.groups.some(g => g.group.web_permissions.appeals.manage === true);
        dotty.deepKeys(manifest, {leavesOnly: true}).forEach((key) => {
            if (typeof AppealService.getNode(key, manifest) === "boolean") {
                if (manage || user.groups.some(g => dotty.get(g.group.web_permissions.appeals, key))) {
                    console.log("Booleaned " + key);
                }
            } else {
                if (manage || user.groups.some(g => dotty.get(g.group.web_permissions.appeals, key) === type)) {
                    console.log("Keyed" + key);
                }
            }
        });

        return manifest;
    }

    private static moderationPermissionChecking(appeal: IAppeal, manifest: IAppealsPermissions, user: IUser, permission: string, moderate?: boolean): void {
        if (!(
            (manifest.manage || AppealService.getNode(permission, manifest) === IAppealPermissible.All) ||
            (
                moderate &&
                (
                    AppealService.getNode(permission, manifest) === IAppealPermissible.Involved &&
                    (
                        appeal.punishment.issuer._id.toString() === user._id.toString() ||
                        (appeal.supervisor && appeal.supervisor._id.toString() === user._id.toString())
                    )
                )
            ) ||
            (
                (
                    (
                        AppealService.getNode(permission, manifest) === IAppealPermissible.Involved ||
                        AppealService.getNode(permission, manifest) === IAppealPermissible.Own
                    ) &&
                    (
                        appeal.punishment.issuer._id.toString() === user._id.toString() ||
                        appeal.punishment.punished._id.toString() === user._id.toString() ||
                        (appeal.supervisor && appeal.supervisor._id.toString() === user._id.toString())
                    )
                )
            )
        )
        ) throw new Error("UnauthorizedError");
    }

    private static getNode(obj, manifest): any {
        if (!manifest) return manifest;
        return obj.split('.').reduce((p,prop) => p[prop], manifest);
    }

}
