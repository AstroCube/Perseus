import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {ITopic} from "../../interfaces/forum/ITopic";
import ForumService from "./forumService";
import {ForumPermissible, IForumPermissions} from "../../interfaces/permissions/IForumPermissions";
import {IUser} from "../../interfaces/IUser";
import {IForum} from "../../interfaces/forum/IForum";

@Service()
export default class TopicService {

    constructor(
        @Inject('topicModel') private topicModel : Models.TopicModel,
        @Inject('logger') private logger: Logger,
        private forumService: ForumService
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

            /**
             * Must check if user and topics are guest or has permission to read at least his own posts.
             */
            if (!user && !topicRecord.forum.guest) throw new ResponseError('You can not access to this topic', 403);
            const permissions: IForumPermissions = await this.forumService.getPermissions(user, topicRecord.forum._id);
            if (
                (!permissions.manage || !user.groups.some(g => g.group.web_permissions.forum.manage)) &&
                ((permissions.view === ForumPermissible.None) ||
                    (permissions.view === ForumPermissible.Own && topicRecord.author._id.toString() !== user._id.toString()))
            ) throw new ResponseError('You can not access to this topic', 403);

            return topicRecord;
        } catch (e) {
            this.logger.error('There was an error creating a topic: %o', e);
            throw e;
        }
    }

    public async list(query?: any, options?: any, user?: IUser): Promise<IPaginateResult<ITopic>> {
        try {
            //@ts-ignore
            const test = await this.topicModel.find({forum: {guest: true}});
            console.log(test);

            //TODO: Encapsulate permissions

            return await this.topicModel.paginate(query, options);
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async update(topic: ITopic, user: IUser): Promise<ITopic> {
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

            /**
             * To subscribe a user you shall pass only one array with the user ID. The requester user MUST
             * be the same at the ID inside the array. Users must not be forced to subscribe manually.
             */
            if (topic.subscribers.length > 0) {
                if (topic.subscribers.length !== 1) throw new ResponseError('You can only pass one user to subscribe', 400);
                if (user._id.toString() !== topic.subscribers[0].toString())
                    throw new ResponseError('You can only subscribe yourself to a topic', 400);
            }

            return await this.topicModel.findByIdAndUpdate(topic._id, {...topic, $push: {subscribers: topic.subscribers[0]}});
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
