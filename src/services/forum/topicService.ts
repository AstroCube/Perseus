import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {IForum} from "../../interfaces/forum/IForum";
import {ITopic} from "../../interfaces/forum/ITopic";

@Service()
export default class TopicService {

    constructor(
        @Inject('topicModel') private topicModel : Models.TopicModel,
        @Inject('logger') private logger: Logger
    ) {}

    public async create(request: ITopic): Promise<ITopic> {
        try {
            const topic: ITopic = await this.topicModel.create(request);
            if (!topic) throw new ResponseError('There was an error creating a topic', 500);
            return topic;
        } catch (e) {
            this.logger.error('There was an error creating a topic: %o', e);
            throw e;
        }
    }

    public async get(id: string): Promise<ITopic> {
        try {
            const topicRecord: ITopic = await this.topicModel.findById(id);
            if (!topicRecord) throw new ResponseError('The requested topic was not found', 404);
            return topicRecord;
        } catch (e) {
            this.logger.error('There was an error creating a topic: %o', e);
            throw e;
        }
    }

    public async list(query?: any, options?: any): Promise<IPaginateResult<ITopic>> {
        try {
            return await this.topicModel.paginate(query, options);
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async update(category: ITopic): Promise<ITopic> {
        try {
            const topicRecord: ITopic = await this.topicModel.findByIdAndUpdate(category._id, category);
            if (!topicRecord) throw new ResponseError('The requested forum was not found', 404);
            return topicRecord;
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            // TODO: Create forum, topic and post deletion
            await this.topicModel.findByIdAndDelete(id);
        } catch (e) {
            this.logger.error('There was an error creating a topic: %o', e);
            throw e;
        }
    }

}
