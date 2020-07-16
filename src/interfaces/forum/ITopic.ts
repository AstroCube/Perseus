import {IModel} from "../IModel";
import {IUser} from "../IUser";
import {IForum} from "./IForum";

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
