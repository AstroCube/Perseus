import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IForumCategory} from "../../interfaces/forum/IForumCategory";
import {ResponseError} from "../../interfaces/error/ResponseError";

@Service()
export default class ForumCategoryService {

    constructor(
        @Inject('forumCategoryModel') private forumCategoryModel : Models.ForumCategoryModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async create(request: IForumCategory): Promise<IForumCategory> {
        try {
            const forumCategory: IForumCategory = await this.forumCategoryModel.create(request);
            if (!forumCategory) throw new ResponseError('There was an error creating a forum category', 500);
            return forumCategory;
        } catch (e) {
            this.logger.error('There was an error creating a forum category: %o', e);
            throw e;
        }
    }

    public async get(id: string): Promise<IForumCategory> {
        try {
            const categoryRecord: IForumCategory = await this.forumCategoryModel.findById(id);
            if (!categoryRecord) throw new ResponseError('The requested category was not found', 404);
            return categoryRecord;
        } catch (e) {
            this.logger.error('There was an error creating an appeal: %o', e);
            throw e;
        }
    }

    public async list(query?: any, options?: any): Promise<IPaginateResult<IForumCategory>> {
        try {
            return await this.forumCategoryModel.paginate(query, options);
        } catch (e) {
            this.logger.error('There was an error creating an appeal: %o', e);
            throw e;
        }
    }

    public async update(category: IForumCategory): Promise<IForumCategory> {
        try {
            const categoryRecord: IForumCategory = await this.forumCategoryModel.findByIdAndUpdate(category._id, category);
            if (!categoryRecord) throw new ResponseError('The requested category was not found', 404);
            return categoryRecord;
        } catch (e) {
            this.logger.error('There was an error creating an appeal: %o', e);
            throw e;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            // TODO: Create forum, topic and post deletion
            await this.forumCategoryModel.findByIdAndDelete(id);
        } catch (e) {
            this.logger.error('There was an error creating an appeal: %o', e);
            throw e;
        }
    }

}
