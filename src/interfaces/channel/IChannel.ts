import {IModel} from "../IModel";
import {IUser} from "../IUser";

export interface IChannel extends IModel {
    name: string;
    lifecycle: number;
    confirmation: boolean;
    visibility: ChannelVisibility;
    participants?: string[] | IUser[];
    permission?: string;
}

export enum ChannelVisibility {
    Public = 'Public', Private = 'Private', Permissions = 'Permissions'
}
