import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {IForum} from "../../interfaces/forum/IForum";
import {IUser} from "../../interfaces/IUser";
import {ForumPermissible, IForumPermissions} from "../../interfaces/permissions/IForumPermissions";
import dotty = require('dotty');

@Service()
export default class ForumService {

    constructor(
        @Inject('forumModel') private forumModel : Models.ForumModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async create(request: IForum): Promise<IForum> {
        try {
            const forum: IForum = await this.forumModel.create({...request});
            if (!forum) throw new ResponseError('There was an error creating a forum', 500);
            return forum;
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async get(id: string, user?: IUser): Promise<IForum> {
        try {
            let forumRecord: IForum = await this.forumModel.findById(id).lean();
            if (!forumRecord) throw new ResponseError('The requested forum was not found', 404);
            if (!user && !forumRecord.guest) throw new ResponseError('You can not have access to the requested forum', 403);
            if (user) {
                const permissions: IForumPermissions = await this.getPermissions(user, forumRecord._id);
                if (permissions.view === ForumPermissible.None) throw new ResponseError('You can not have access to the requested forum', 403);
            }
            forumRecord._id = id;
            return forumRecord;
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async list(user: IUser, query?: any, options?: any): Promise<IPaginateResult<IForum>> {
        try {
            return await this.forumModel.paginate(query, options);
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async update(category: IForum): Promise<IForum> {
        try {
            const forumRecord: IForum = await this.forumModel.findByIdAndUpdate(category._id, category, {new: true});
            if (!forumRecord) throw new ResponseError('The requested forum was not found', 404);
            return forumRecord;
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            // TODO: Create forum, topic and post deletion
            await this.forumModel.findByIdAndDelete(id);
        } catch (e) {
            this.logger.error('There was an error deleting a forum: %o', e);
            throw e;
        }
    }

    public async getPermissions(user: IUser, id: string): Promise<IForumPermissions> {
        try {
            let manifest = {
                id,
                manage: false,
                create: false,
                view: ForumPermissible.None,
                edit: ForumPermissible.None,
                comment: ForumPermissible.None,
                delete: false,
                pin: false,
                lock: false,
                globalAdmin: false,
                official: false
            };

            manifest = this.transactionalPermissions(manifest, user, id, ForumPermissible.Own);
            manifest = this.transactionalPermissions(manifest, user, id, ForumPermissible.All);
            return manifest;
        } catch (e) {
            this.logger.error('There was an error obtaining the permissible manifest: %o', e);
            throw e;
        }
    }

    private transactionalPermissions(manifest: IForumPermissions, user: IUser, id: string, type: ForumPermissible): IForumPermissions {
        const manage =
            user.groups.some(g => g.group.web_permissions.forum.manage) ||
            user.groups.some(g => g.group.web_permissions.forum.allowance.some(a => a.id.toString() === id && a.manage));

        user.groups.forEach(g => {
            console.log(g.group.web_permissions.forum.allowance);
        });

        dotty.deepKeys(manifest, {leavesOnly: true}).forEach((key) => {
            if (key !== "id") {
                if (typeof dotty.get(manifest, key) === "boolean") {
                    if (
                        manage ||
                        user.groups.some(g => g.group.web_permissions.forum.allowance.some(
                            a => dotty.exists(a, key) && dotty.get(a, key)
                        ))
                    ) {
                        dotty.put(manifest, key, true);
                    }
                } else {
                    if (
                        manage ||
                        user.groups.some(g => g.group.web_permissions.forum.allowance.some(
                            a => dotty.exists(a, key) && dotty.get(a, key) === type
                        ))
                    ) {
                        dotty.put(manifest, key, type);
                    }
                }
            }
        });

        if (user.groups.some(g => g.group.web_permissions.forum.official)) manifest.official = true;

        return manifest;
    }

    public getFullViewForums(user: IUser): string[] {
        let availableGroups: string[] = [];
        user.groups.forEach(group => {
            group.group.web_permissions.forum.allowance.forEach(allowance => {
                if (allowance.manage || allowance.view === ForumPermissible.All) availableGroups.push(allowance.id);
            });
        });
        return availableGroups.filter((v,i) => availableGroups.indexOf(v) === i);
    }

    public getOwnViewForums(user: IUser): string[] {
        let availableGroups: string[] = [];
        user.groups.forEach(group => {
            group.group.web_permissions.forum.allowance.forEach(allowance => {
                if (allowance.view === ForumPermissible.Own) availableGroups.push(allowance.id);
            });
        });
        return availableGroups.filter((v,i) => availableGroups.indexOf(v) === i);
    }

    public getAvailableForums(user: IUser): string[] {
        const available = this.getFullViewForums(user).concat(this.getOwnViewForums(user));
        return available.filter((v,i) => available.indexOf(v) === i);
    }

}
