/*
import {Service} from "typedi";
import ForumService from "../services/forum/forumService";
import {IForum, IForumHolder} from "../interfaces/forum/IForum";
import {IPaginateResult} from "mongoose";
import PostService from "../services/forum/postService";
import TopicService from "../services/forum/topicService";
import {ITopic} from "../interfaces/forum/ITopic";
import {IUser} from "../interfaces/IUser";
import {IPost} from "../interfaces/forum/IPost";

@Service()
export class ForumUtilities {

    constructor(
        private forumService: ForumService,
        private postService: PostService,
        private topicService: TopicService
    ) {
    }

    public getChildren(): Promise<IForumHolder[]> {

    }

    public async getHolder(forum: IForum, user?: IUser): Promise<IForumHolder> {

        const topic: IPaginateResult<ITopic> =
            await this.topicService.list({forum: forum._id}, {page: -1, perPage: 10, sort: 'createdAt'});
        const messages: IPaginateResult<IPost> =
            await this.postService.list({topic: forum._id}, {page: -1, perPage: 10, sort: 'createdAt'}, user);

        return {
            forum,
            unread: user ? await this.getUnreadMessages(forum, topic.data, user) : 0,
            topics: topic.data.length,
            messages: messages.data.length,
            lastTopic: topic.data[0]
        };

    }

    public async getUnreadMessages(forum: IForum, topics: ITopic[], user: IUser): Promise<number> {
        const posts: IPaginateResult<IPost> = await this.postService.list(
            {topic: {$in: topics.map(t => t._id)}, $not: {viewed: user._id}},
            {page: -1, perPage: 10},
            user
        );
        return posts.data.length;
    }

}

 */
