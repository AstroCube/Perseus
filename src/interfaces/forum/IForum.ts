import {IModel} from "../IModel";
import {IForumCategory} from "./IForumCategory";
import {ITopic, ITopicHolder} from "./ITopic";
import {IForumPermissions} from "../permissions/IForumPermissions";
import {IPagination} from "mongoose";
import {IUser} from "../IUser";

export interface IForum extends IModel {
    name: string;
    order: number;
    description: string;
    category: IForumCategory;
    parent?: IForum;
    guest: boolean;
}

export interface IForumHolder {
    forum: IForum;
    unread: number;
    topics: number;
    messages: number;
    lastTopic: ITopic;
}

export interface IForumMain {
    category: IForumCategory;
    holder: IForumHolder[];
}

export interface IForumView {
    child: IForumHolder[];
    permissions: IForumPermissions;
    forum: IForum;
    topic: ITopicHolder[];
    pinned: ITopicHolder[];
    pagination: IPagination;
    user?: IUser;
}
