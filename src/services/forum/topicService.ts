import {Document, IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {ITopic, ITopicUpdate} from "../../interfaces/forum/ITopic";
import ForumService from "./forumService";
import {ForumPermissible, IForumPermissions} from "../../interfaces/permissions/IForumPermissions";
import {IUser} from "../../interfaces/IUser";

@Service()
export default class TopicService {

    constructor(
        @Inject('topicModel') private topicModel : Models.TopicModel,
        @Inject('forumModel') private forumModel : Models.ForumModel,
        @Inject('postModel') private postModel: Models.PostModel,
        @Inject('logger') private logger: Logger,
        private forumService: ForumService,
    ) {}

    public async create(request: ITopic, user: IUser): Promise<ITopic> {
        try {

            /**
             * Must check if user can create topics inside the forum
             */
            const manage: boolean = user.groups.some(g => g.group.web_permissions.forum.manage);
            const permissions: IForumPermissions = await this.forumService.getPermissions(user, request.forum._id);
            if (!manage && !permissions.manage && !permissions.create)
                throw new ResponseError('You can not create topic in forum', 403);

            const topic: ITopic = await this.topicModel.create(request);
            if (!topic) throw new ResponseError('There was an error creating a topic', 500);
            return topic;
        } catch (e) {
            this.logger.error('There was an error creating a topic: %o', e);
            throw e;
        }
    }

    public async get(id: string, user?: IUser): Promise<ITopic> {
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
            return await this.topicModel.paginate(query, {...options});
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async update(topic: ITopicUpdate, user: IUser): Promise<ITopic> {
        try {
            const topicRecord: ITopic = await this.topicModel.findById(topic._id);
            if (!topicRecord) throw new ResponseError('The requested forum was not found', 404);
            const permissions: IForumPermissions = await this.forumService.getPermissions(user, topicRecord._id);

            /**
             * Check if is not superAdmin of forum
             */
            if (!user.groups.some(g => g.group.web_permissions.forum.manage) && !permissions.manage
            ) {
                /**
                 * Here will check if user has at least permission to edit own posts and will give a grace time of 15 minutes.
                 */
                if (permissions.edit !== ForumPermissible.All && topicRecord.subject !== topic.subject) {
                    const date: Date = new Date(new Date(topicRecord.createdAt).getTime() + (15 * 60000));
                    if (date.getTime() < new Date().getTime() || permissions.edit === ForumPermissible.None)
                        throw new ResponseError('You do not have permission to update the topic.', 403);
                }

                if (topic.pinned !== topicRecord.pinned && !permissions.pin)
                    throw new ResponseError('You do not have permission to pin this topic.', 403);
                if (topic.locked !== topicRecord.locked && !permissions.lock)
                    throw new ResponseError('You do not have permission to lock this topic.', 403);
                if (topic.official !== topicRecord.locked && !user.groups.some(g => g.group.web_permissions.forum.official))
                    throw new ResponseError('You do not have permission to officialize this topic.', 403);
            }

            Reflect.deleteProperty(topic, 'forum');
            Reflect.deleteProperty(topic, 'subscribers');
            return await this.topicModel.findByIdAndUpdate(topic._id, {...topic}, {new: true});
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async subscriptionStatus(id: string, user: IUser): Promise<ITopic> {
        try {
            const topicRecord: ITopic = await this.get(id, user);
            if ((topicRecord.subscribers as string[]).includes(user._id))
                //@ts-ignore
                return this.topicModel.findByIdAndUpdate(id, {subscribers: {$push: user._id}}, {new: true});
            //@ts-ignore
            return this.topicModel.findByIdAndUpdate(id, {subscribers: {$pull: user._id}}, {new: true});
        } catch (e) {
            this.logger.error('There was an error subscribing a user to a forum: %o', e);
            throw e;
        }
    }

    public async delete(id: string, user: IUser): Promise<void> {
        try {
            const topic: ITopic = await this.topicModel.findById(id);
            if (!topic) throw new ResponseError('The requested forum was not found', 404);

            const permissions: IForumPermissions = await this.forumService.getPermissions(user, topic._id);
            if (!user.groups.some(g => g.group.web_permissions.forum.manage) && !permissions.manage
            ) {
                if (!permissions.delete) {
                    const date: Date = new Date(new Date(topic.createdAt).getTime() + (15 * 60000));
                    if (date.getTime() < new Date().getTime() || user._id.toString() !== topic._id.toString())
                        throw new ResponseError('You do not have permission to update the topic.', 403);
                }
            }

            await topic.delete(user._id);
            await this.postModel.delete({topic: topic._id}, user._id);

        } catch (e) {
            this.logger.error('There was an error creating a topic: %o', e);
            throw e;
        }
    }

}
