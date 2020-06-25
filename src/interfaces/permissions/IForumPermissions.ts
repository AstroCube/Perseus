export interface IForumPermissions {
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

export enum ForumPermissible {
    All = 'All', Own = 'Own', None = 'None'
}
