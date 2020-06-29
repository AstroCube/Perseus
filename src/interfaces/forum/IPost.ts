import {IModel} from "../IModel";
import {IUser} from "../IUser";
import {ITopic} from "./ITopic";

export interface IPost extends IModel {
    content: string;
    author: IUser;
    quote: IPost | string;
    lastAction: IUser | string;
    topic: ITopic | string;
    viewed: IUser[] | string[];
    liked: IUser[] | string[];
}
