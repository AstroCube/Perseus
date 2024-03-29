import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {ResponseError} from "../../interfaces/error/ResponseError";
import {IPost} from "../../interfaces/forum/IPost";
import {ITopic} from "../../interfaces/forum/ITopic";
import TopicService from "./topicService";
import {ForumPermissible, IForumPermissions} from "../../interfaces/permissions/IForumPermissions";
import ForumService from "./forumService";
import {IUser} from "../../interfaces/IUser";

@Service()
export default class PostService {

    constructor(
        @Inject('postModel') private postModel : Models.PostModel,
        @Inject('logger') private logger: Logger,
        private topicService: TopicService,
        private forumService: ForumService
    ) {}

    public async create(request: IPost, user: IUser): Promise<IPost> {
        try {
            const topic: ITopic = await this.topicService.get(request.topic as string, user);
            if (!topic) throw new ResponseError('The requested topic was not found', 404);

            const related: IPost[] = await this.postModel.find({topic: topic._id});
            const permissions: IForumPermissions = await this.forumService.getPermissions(user,  topic.forum._id);

            /**
             * Check if user is superAdmin. Otherwise will check if post is the first of the topic to get
             * create permission or comment in case of not being the first post.
             */
            if (!permissions.manage && !user.groups.some(g => g.group.web_permissions.forum.manage)) {
                if (related.length < 1) {
                    if (!permissions.create) throw new ResponseError('You do not have permission to comment in this topic', 403);
                } else {
                    if (
                        !(permissions.comment === ForumPermissible.All ||
                            (
                                permissions.comment !== ForumPermissible.None &&
                                topic.author._id.toString() === user._id.toString()
                            ))
                    ) throw new ResponseError('You do not have permissions to comment in this topic', 404);
                }
            }

            request.viewed = [user._id];

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

    public async readTopicMessages(id: string, user: IUser): Promise<void> {
        try {
            await this.postModel.updateMany({topic: id, viewed: {$ne: user._id}}, {$push: {viewed: user._id}});
        } catch (e) {
            this.logger.error('There was an error creating a forum: %o', e);
            throw e;
        }
    }

    public async likeStatus(id: string, user: IUser): Promise<IPost> {
        try {
            const postRecord: IPost = await this.get(id);
            if ((postRecord.liked as string[]).includes(user._id))
                //@ts-ignore
                return this.postModel.findByIdAndUpdate(id, {$pull: {liked: user._id}}, {new: true});
            //@ts-ignore
            return this.postModel.findByIdAndUpdate(id, {$push: {liked: user._id}}, {new: true});
        } catch (e) {
            this.logger.error('There was an error liking post for an user: %o', e);
            throw e;
        }
    }

    public async list(query?: any, options?: any): Promise<IPaginateResult<IPost>> {
        try {
            return await this.postModel.paginate({...query}, options);
        } catch (e) {
            this.logger.error('There was an error creating a post: %o', e);
            throw e;
        }
    }

    public async update(post: IPost, user: IUser): Promise<IPost> {
        try {
            delete post.quote;
            delete post.liked;
            delete post.viewed;
            delete post.author;
            delete post.topic;

            const postRecord: IPost = await this.postModel.findById(post._id);
            if (!postRecord) throw new ResponseError('The requested post was not found', 404);
            const permissions: IForumPermissions = await this.forumService.getPermissions(user,  (postRecord.topic as ITopic)._id);

            /**
             * Check if user hast All permissions, otherwise if is the same and hasn't elapsed 15 minutes after
             * post creation to generate edition access.
             */
            if (!user.groups.some(g => g.group.web_permissions.forum.manage) && !permissions.manage
            ) {
                if (permissions.edit !== ForumPermissible.All && (postRecord.topic as ITopic).author._id.toString() !== user._id.toString()) {
                    throw new ResponseError('You do not have permission to update the topic.', 403);
                } else {
                    const date: Date = new Date(new Date(postRecord.createdAt).getTime() + (15 * 60000));
                    if (date.getTime() < new Date().getTime() || permissions.edit === ForumPermissible.None)
                        throw new ResponseError('You can not edit the topic after 15 minutes of created.', 403);
                }
            }

            return this.postModel.findByIdAndUpdate(post._id, {...post, lastAction: user._id}, {new: true});
        } catch (e) {
            this.logger.error('There was an error creating a post: %o', e);
            throw e;
        }
    }

    public async delete(id: string, user: IUser): Promise<void> {
        try {

            const post: IPost = await this.postModel.findById(id);
            if (!post) throw new ResponseError('The requested post was not found', 404);

            const permissions: IForumPermissions = await this.forumService.getPermissions(user, (post.topic as ITopic).forum._id);

            if (!user.groups.some(g => g.group.web_permissions.forum.manage) && !permissions.manage
            ) {
                if (!permissions.delete) {
                    const date: Date = new Date(new Date(post.createdAt).getTime() + (15 * 60000));
                    if (date.getTime() < new Date().getTime() || user._id.toString() !== post.author.toString())
                        throw new ResponseError('You do not have permission to update the post.', 403);
                }
            }

            await post.delete();
        } catch (e) {
            this.logger.error('There was an error creating a post: %o', e);
            throw e;
        }
    }

    public async readAll(id: string, user: IUser): Promise<void> {
        try {

            const permissions: IForumPermissions = await this.forumService.getPermissions(user, id);
            if (permissions.view === ForumPermissible.None)
                throw new ResponseError('You do not have access to read this forum', 403);

            let query: any =  {forum: id};
            if (permissions.view === ForumPermissible.Own) query = {forum: id, author: user._id};

            const allowedTopics: IPaginateResult<ITopic> =
                await this.topicService.list(query, {perPage: 10});

            allowedTopics.data.forEach(t => this.readTopicMessages(t._id, user));

        } catch (e) {
            this.logger.error('There was an checking as read all posts for user: %o', e);
            throw e;
        }
    }

}
