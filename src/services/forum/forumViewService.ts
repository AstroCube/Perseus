import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {IForum, IForumView} from "../../interfaces/forum/IForum";
import {IUser} from "../../interfaces/IUser";
import {ForumPermissible, IForumPermissions} from "../../interfaces/permissions/IForumPermissions";
import dotty = require('dotty');

@Service()
export default class ForumViewService {

    constructor(
        @Inject('logger') private logger: Logger
    ) {}

    /**
     * public async forumViewData(): Promise<IForumView> {
        try {

        } catch (e) {
            this.logger.error('There was an error obtaining forum view: %o', e);
            throw e;
        }
    }
     */

}
