import {IModel} from "../IModel";
import {IUser} from "../IUser";
import {ITopic} from "./ITopic";

export interface IPost extends IModel {
    content: string;
    author: IUser;
    quote: IPost;
    lastAction: IUser;
    topic: ITopic;
    viewed: IUser[];
    liked: IUser[];
}
