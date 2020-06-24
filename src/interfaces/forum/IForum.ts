import {IModel} from "../IModel";
import {IForumPermissions} from "../permissions/IForumPermissions";
import {IForumCategory} from "./IForumCategory";

export interface IForum extends IModel {
    name: string;
    order: number;
    description: string;
    category: IForumCategory;
    parent?: IForum;
    permissions: IForumPermissions;
}
