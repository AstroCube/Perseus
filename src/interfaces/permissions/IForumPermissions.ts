export interface IForumPermissions extends IForumGlobal {
    id: string;
    manage: boolean;
    create: boolean;
    view: ForumPermissible;
    edit: ForumPermissible;
    comment: ForumPermissible;
    delete: boolean;
    pin: boolean;
    lock: boolean;
}

export interface IForumGlobal {
    globalAdmin: boolean;
    official: boolean;
}

export enum ForumPermissible {
    All = 'All', Own = 'Own', None = 'None'
}
