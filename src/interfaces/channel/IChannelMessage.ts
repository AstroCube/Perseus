import {IModel} from "../IModel";
import {IUser} from "../IUser";
import {IChannel} from "./IChannel";

export interface IChannelMessage extends IModel {
    sender: string | IUser;
    channel: string | IChannel;
    origin: MessageOrigin;
    message: string;
    viewed?: string[] | IUser[];
    meta: any;
}

export enum MessageOrigin {
    InGame = "InGame", Website = "Website"
}
