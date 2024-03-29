import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IForum, IForumHolder, IForumMain, IForumView} from "../../interfaces/forum/IForum";
import {ForumUtilities} from "../../utilities/forum-utilities";
import {IUser} from "../../interfaces/IUser";
import ForumService from "./forumService";
import {IPaginateResult} from "mongoose";
import {ForumPermissible, IForumPermissions} from "../../interfaces/permissions/IForumPermissions";
import {ITopic, ITopicHolder, ITopicInteraction, ITopicView} from "../../interfaces/forum/ITopic";
import {ResponseError} from "../../interfaces/error/ResponseError";
import TopicService from "./topicService";
import PostService from "./postService";
import {IPost} from "../../interfaces/forum/IPost";

@Service()
export default class ForumViewService {

    constructor(
        @Inject('logger') private logger: Logger,
        private forumService: ForumService,
        private topicService: TopicService,
        private postService: PostService,
        private forumUtilities:  ForumUtilities
    ) {}

    public async forumViewData(id: string, page: number, perPage: number, user?: IUser): Promise<IForumView> {
        try {

            const forum: IForum = await this.forumService.get(id, user);

            const permissions: IForumPermissions = user ? await this.forumService.getPermissions(user, forum._id) :
                this.forumUtilities.getGuestPermissions(forum._id);

            if ((!forum.guest && !user) || (user && permissions.view === ForumPermissible.None))
                throw new ResponseError('You have no access to this forum', 403);

            let query: any = {forum: forum._id};
            if (permissions.view === ForumPermissible.Own) query = {forum: forum._id, author: user._id};

            let pinned: IPaginateResult<ITopic> =
                await this.topicService.list({...query, pinned: true}, {perPage: 10, sort: {createdAt: -1}});

            let pinPlaceholder: ITopicHolder[] = [];
            for (const pin of pinned.data) pinPlaceholder.push(await this.forumUtilities.getTopicHolder(pin, user));

            let topics: IPaginateResult<ITopic> =
                await this.topicService.list({...query, pinned: false}, {page, perPage, sort: {createdAt: -1}});
            let topicPlaceholder: ITopicHolder[] = [];
            for (const topic of topics.data) topicPlaceholder.push(await this.forumUtilities.getTopicHolder(topic, user));


            return {
                child: await this.forumUtilities.getHolders({parent: forum._id},  user),
                permissions: permissions,
                forum,
                pinned: pinPlaceholder,
                topic: topicPlaceholder,
                pagination: topics.pagination,
                user
            };

        } catch (e) {
            this.logger.error('There was an error rendering forum view data: %o', e);
            throw e;
        }
    }

    public async topicViewData(id: string, page: number, perPage: number, user?: IUser): Promise<ITopicView> {
        try {
            const topic: ITopic = await this.topicService.get(id);
            let modifiedTopic = topic;
            modifiedTopic.forum._id = topic.forum._id.toString();

            const permissions: IForumPermissions = user ? await this.forumService.getPermissions(user, topic.forum._id) :
                this.forumUtilities.getGuestPermissions(topic.forum._id);

            if (
                (!topic.forum.guest && !user) ||
                (user && permissions.view === ForumPermissible.None) ||
                (user &&  permissions.view === ForumPermissible.Own && user._id.toString() !== topic.author._id.toString())
            )
                throw new ResponseError('You have no access to this forum', 403);

            const posts: IPaginateResult<IPost> =
                await this.postService.list({topic: topic._id}, {page, perPage, sort: 'createdAt'});

            if (user) await this.postService.readTopicMessages(topic._id, user);

            return {
                topic: modifiedTopic,
                user,
                permissions,
                posts
            };
        } catch (e) {
            this.logger.error('There was an error rendering topic view data: %o', e);
            throw e;
        }
    }

    public async forumMainData(user?: IUser): Promise<IForumMain[]> {
        try {
            let query: any = {guest: true, parent: {$exists: false}};
            if (user) {
                query = {parent: {$exists: false}, _id: {$in: this.forumService.getAvailableForums(user)}};
                if (user.groups.some(g => g.group.web_permissions.forum.manage)) query = {parent: {$exists: false}};
            }

            let main: IForumMain[] = [];
            let forumHolders: IForumHolder[] = await this.forumUtilities.getHolders(query, user);

            for (const forum of forumHolders) {
                if (!main.some(m => m.category._id === forum.forum.category._id))
                    main.push({category: forum.forum.category, holder: []});

                main.find(f => f.category._id === forum.forum.category._id).holder.push(
                    await this.forumUtilities.getHolder(forum.forum, user)
                );
            }

            return main;
        } catch (e) {
            this.logger.error('There was an error rendering topic view data: %o', e);
            throw e;
        }
    }

    public async topicInteractView(topic: string, user: IUser, quote?: string): Promise<ITopicInteraction> {
        try {

            const topicRecord: ITopic = await this.topicService.get(topic, user);
            const permissions: IForumPermissions = await this.forumService.getPermissions(user, topicRecord._id);

            if (
                (permissions.view === ForumPermissible.None)  ||
                (permissions.view === ForumPermissible.Own && topicRecord._id.toString() !== user._id.toString())
            ) throw new ResponseError('You do not have access to this forum', 403);

            const original: IPaginateResult<IPost> =
                await this.postService.list({topic}, {perPage: 10, sort: 'createdAt'});

            let quotedPost: IPost;
            if (quote) {
                quotedPost = await this.postService.get(quote);
                if (!quotedPost) throw new ResponseError('Requested quote was not found', 404);
            }

            let finalTopic: ITopic = topicRecord;
            finalTopic._id = topic;

            return {
                user,
                topic: finalTopic,
                original: original.data[0],
                quote: quotedPost
            };
        } catch (e) {
            this.logger.error('There was an error rendering topic view data: %o', e);
            throw e;
        }
    }

    public async getNewTopics(user?: IUser): Promise<IPaginateResult<ITopic>> {
        try {
            const guestForums: IPaginateResult<IForum> =
                await this.forumService.list({guest: true});
            const guestId: string [] = guestForums.data.map(g => g._id);

            let query: any = {forum: {$in: guestId}};
            if (user) {
                if (user.groups.some(g => g.group.web_permissions.forum.manage))
                    query  = {};
                else
                    query = {
                    $or: [
                        {forum: {$in: guestId}},
                        {forum: {$in: this.forumService.getFullViewForums(user)}},
                        {forum: {$in: this.forumService.getOwnViewForums(user), author: user._id}}
                        ]
                };
            }

            return this.topicService.list(query, {page: 1, perPage: 10});
        }
        catch (e) {
            this.logger.error('There was an error obtaining last posts: %o', e);
            throw e;
        }
    }

}
