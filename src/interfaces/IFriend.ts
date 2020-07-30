import {IModel} from "./IModel";
import {IUser} from "./IUser";

export interface IFriend extends IModel {
    sender: IUser | string;
    receiver: IUser | string;
    issuer: IUser | string;
    website: boolean;
}

export interface IFriendProfile {
    friends: IFriend[];
    commons: number;
}
