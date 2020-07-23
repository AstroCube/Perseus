import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IForum, IForumView} from "../../interfaces/forum/IForum";
import {ForumUtilities} from "../../utilities/forum-utilities";
import {IUser} from "../../interfaces/IUser";
import ForumService from "./forumService";
import {IPaginateResult} from "mongoose";
import {ForumPermissible, IForumPermissions} from "../../interfaces/permissions/IForumPermissions";
import {ITopic, ITopicHolder} from "../../interfaces/forum/ITopic";
import {ResponseError} from "../../interfaces/error/ResponseError";
import TopicService from "./topicService";

@Service()
export default class ForumViewService {

    constructor(
        @Inject('logger') private logger: Logger,
        private forumService: ForumService,
        private topicService:  TopicService,
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
                await this.topicService.list({...query, pinned: true}, {perPage: 10, sort: 'createdAt'});
            let pinPlaceholder: ITopicHolder[] = [];
            console.log(pinned.data);
            for (const pin of pinned.data) pinPlaceholder.push(await this.forumUtilities.getTopicHolder(pin, user));

            let topics: IPaginateResult<ITopic> =
                await this.topicService.list({...query, pinned: false}, {page, perPage, sort: 'createdAt'});
            let topicPlaceholder: ITopicHolder[] = [];
            for (const topic of topics.data) topicPlaceholder.push(await this.forumUtilities.getTopicHolder(topic, user));


            return {
                child: await this.forumUtilities.getChildren(forum, user),
                permissions: permissions,
                forum,
                pinned: pinPlaceholder,
                topic: topicPlaceholder,
                pagination: topics.pagination,
                user
            };

        } catch (e) {
            this.logger.error('There was an error obtaining forum view: %o', e);
            throw e;
        }
    }


}
