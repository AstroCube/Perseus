import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {IPost} from "../../interfaces/forum/IPost";

@Service()
export default class PostService {

    constructor(
        @Inject('postModel') private postModel : Models.PostModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async create(request: IPost): Promise<IPost> {
        try {
            const post: IPost = await this.postModel.create(request);
            if (!post) throw new ResponseError('There was an error creating a post', 500);
            return post;
        } catch (e) {
            this.logger.error('There was an error creating a post: %o', e);
            throw e;
        }
    }

    public async get(id: string): Promise<IPost> {
        try {
            const postRecord: IPost = await this.postModel.findById(id);
            if (!postRecord) throw new ResponseError('The requested post was not found', 404);
            return postRecord;
        } catch (e) {
            this.logger.error('There was an error creating a topic: %o', e);
            throw e;
        }
    }

    public async list(query?: any, options?: any): Promise<IPaginateResult<IPost>> {
        try {
            return await this.postModel.paginate(query, options);
        } catch (e) {
            this.logger.error('There was an error creating a post: %o', e);
            throw e;
        }
    }

    public async update(category: IPost): Promise<IPost> {
        try {
            const postRecord: IPost = await this.postModel.findByIdAndUpdate(category._id, category);
            if (!postRecord) throw new ResponseError('The requested post was not found', 404);
            return postRecord;
        } catch (e) {
            this.logger.error('There was an error creating a post: %o', e);
            throw e;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            // TODO: Create forum, topic and post deletion
            await this.postModel.findByIdAndDelete(id);
        } catch (e) {
            this.logger.error('There was an error creating a post: %o', e);
            throw e;
        }
    }

}
