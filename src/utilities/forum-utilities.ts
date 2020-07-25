import {Service} from "typedi";
import ForumService from "../services/forum/forumService";
import {IForum, IForumHolder} from "../interfaces/forum/IForum";
import {IPaginateResult} from "mongoose";
import PostService from "../services/forum/postService";
import TopicService from "../services/forum/topicService";
import {ITopic, ITopicHolder} from "../interfaces/forum/ITopic";
import {IUser} from "../interfaces/IUser";
import {IPost} from "../interfaces/forum/IPost";
import {ForumPermissible, IForumPermissions} from "../interfaces/permissions/IForumPermissions";

@Service()
export class ForumUtilities {

    constructor(
        private forumService: ForumService,
        private postService: PostService,
        private topicService: TopicService
    ) {
    }

    public async getHolders(query: any, user?: IUser): Promise<IForumHolder[]> {
        const children: IPaginateResult<IForum>
            = await this.forumService.list(user, query, {perPage: 10});
        let holders: IForumHolder[] = [];

        for (const f of children.data) {
            const holder: IForumHolder = await this.getHolder(f as any, user);
            if (holder !== null) holders.push(holder);
        }

        return holders;
    }

    public async getHolder(forum: IForum, user?: IUser): Promise<IForumHolder> {
        let finalForum: any = forum;
        finalForum._id = forum._id.toString();

        const permissions: IForumPermissions = user ? await this.forumService.getPermissions(user, finalForum._id) :
            this.getGuestPermissions(finalForum._id);

        console.log(permissions);

        if ((!forum.guest && !user) || (user && permissions.view === ForumPermissible.None)) return null;

        console.log("Not null");

        let query: any = {forum: finalForum._id};
        if (permissions.view === ForumPermissible.Own) query = {forum: finalForum._id, author: user._id};

        console.log(query);

        const topic: IPaginateResult<ITopic> =
            await this.topicService.list(query, {perPage: 10, sort: 'createdAt'});

        const messages: IPaginateResult<IPost> =
            await this.postService.list({topic: {$in: topic.data.map(f => f._id)}}, { perPage: 10, sort: 'createdAt'}, user);

        return {
            forum: finalForum as IForum,
            unread: user ? await this.getUnreadMessages(forum, topic.data, user) : 0,
            topics: topic.data.length,
            messages: messages.data.length,
            lastTopic: topic.data[0]
        };
    }

    public async getUnreadMessages(forum: IForum, topics: ITopic[], user: IUser): Promise<number> {
        const posts: IPaginateResult<IPost> = await this.postService.list(
            {topic: {$in: topics.map(t => t._id)}, viewed: {$ne: user._id}},
            {perPage: 10},
            user
        );
        return posts.data.length;
    }

    public getGuestPermissions(id: string): IForumPermissions {
        return {
            id,
            manage: false,
            create: false,
            view: ForumPermissible.All,
            edit: ForumPermissible.None,
            comment: ForumPermissible.None,
            delete: false,
            pin: false,
            lock: false,
            globalAdmin: false,
            official: false
        };
    }

    public async getTopicHolder(topic: ITopic, user?: IUser): Promise<ITopicHolder> {
        const posts: IPaginateResult<IPost> =
            await this.postService.list({topic: topic._id}, {perPage: 10, sort: 'createdAt'});

        let unique: string[] = [];
        posts.data.forEach((p) => unique = unique.concat(p.viewed as string[]));

        return {
            topic,
            unread: user ? posts.data.filter(post => (post.viewed as string[]).includes(user ? user._id : '')).length : 0,
            messages: posts.data.length,
            views: unique.length,
            lastPost: posts.data.sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt))[0]
        };
    }

}
