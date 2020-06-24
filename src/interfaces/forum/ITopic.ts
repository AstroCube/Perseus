import {IModel} from "../IModel";
import {IUser} from "../IUser";
import {IForum} from "./IForum";

export interface ITopic extends IModel {
    subject: string;
    author: IUser;
    forum: IForum;
    subscribers: IUser[];
    pinned: boolean;
    official: boolean;
    locked: boolean;
}
