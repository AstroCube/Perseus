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

            const post: IPost = await this.postModel.create(request);
            if (!post) throw new ResponseError('There was an error creating a post', 500);
            return post;
        } catch (e) {
            this.logger.error('There was an error creating a post: %o', e);
            throw e;
        }
    }

    public async get(id: string, user?: IUser): Promise<IPost> {
        try {
            const postRecord: IPost = await this.postModel.findById(id);
            if (!postRecord) throw new ResponseError('The requested post was not found', 404);
            return postRecord;
        } catch (e) {
            this.logger.error('There was an error creating a topic: %o', e);
            throw e;
        }
    }

    public async likeStatus(id: string, user: IUser): Promise<IPost> {
        try {
            const postRecord: IPost = await this.get(id, user);
            if ((postRecord.liked as string[]).includes(user._id))
                //@ts-ignore
                return this.postModel.findByIdAndUpdate(id, {liked: {$push: user._id}}, {new: true});
            //@ts-ignore
            return this.postModel.findByIdAndUpdate(id, {liked: {$pull: user._id}}, {new: true});
        } catch (e) {
            this.logger.error('There was an error liking post for an user: %o', e);
            throw e;
        }
    }

    public async list(query?: any, options?: any, user?: IUser): Promise<IPaginateResult<IPost>> {
        try {
            //TODO: Validate permission
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
            if (permissions.edit !== ForumPermissible.All && (postRecord.topic as ITopic).author._id.toString() !== user._id.toString()) {
                throw new ResponseError('You do not have permission to update the topic.', 403);
            } else {
                const date: Date = new Date(new Date(postRecord.createdAt).getTime() + (15 * 60000));
                if (date.getTime() < new Date().getTime() || permissions.edit === ForumPermissible.None)
                    throw new ResponseError('You do not have permission to update the topic.', 403);
            }


            return this.postModel.findByIdAndUpdate(post._id, {...post, lastAction: user._id}, {new: true});
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
