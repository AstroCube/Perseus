import {IModel} from "../IModel";
import {IUser} from "../IUser";
import {IForum} from "./IForum";
import {IPost} from "./IPost";
import {IPaginateResult} from "mongoose";
import {IForumPermissions} from "../permissions/IForumPermissions";

export interface ITopic extends IModel {
    subject: string;
    author: IUser;
    forum: IForum;
    subscribers: IUser[] | string[];
    pinned: boolean;
    official: boolean;
    locked: boolean;
}

export interface ITopicUpdate {
    _id: string;
    subject: string;
    pinned: boolean;
    official: boolean;
    locked: boolean;
}

export interface ITopicHolder {
    topic: ITopic;
    unread: number;
    messages: number;
    views: number;
    lastPost: IPost;
}

export interface ITopicView {
    topic: ITopic;
    user: IUser;
    posts: IPaginateResult<IPost>;
    permissions: IForumPermissions;
}
