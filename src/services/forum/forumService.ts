import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IForumCategory} from "../../interfaces/forum/IForumCategory";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {IForum} from "../../interfaces/forum/IForum";

@Service()
export default class ForumService {

    constructor(
        @Inject('forumModel') private forumModel : Models.ForumModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async create(request: IForum): Promise<IForum> {
        try {
            const forum: IForum = await this.forumModel.create(request);
            if (!forum) throw new ResponseError('There was an error creating a forum', 500);
            return forum;
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async get(id: string): Promise<IForum> {
        try {
            const forumRecord: IForum = await this.forumModel.findById(id);
            if (!forumRecord) throw new ResponseError('The requested forum was not found', 404);
            return forumRecord;
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async list(query?: any, options?: any): Promise<IPaginateResult<IForum>> {
        try {
            return await this.forumModel.paginate(query, options);
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async update(category: IForum): Promise<IForum> {
        try {
            const forumRecord: IForum = await this.forumModel.findByIdAndUpdate(category._id, category);
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

}
