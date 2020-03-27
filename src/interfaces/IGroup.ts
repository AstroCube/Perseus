import { IModel } from "./IModel";
import { IPunishmentPermissions } from "./permissions/IPunishmentPermissions";
import { IAppealsPermissions } from "./permissions/IAppealsPermissions";
import { IReportsPermissions } from "./permissions/IReportsPermissions";

export interface IGroup extends IModel {
  name: string;
  priority: number;
  html_color: string;
  badge_color: string;
  badge_link: string;
  minecraft_flair: IMinecraftFlair[];
  minecraft_permissions: string[];
  staff: boolean;
  discord_role: string;
  web_permissions: IPermissions;
}

export interface IMinecraftFlair {
  realm: string;
  color: string;
  symbol: string;
}

export interface IPermissions {
  user: {
    manage: boolean;
  };
  group: {
    manage: boolean;
  };
  category: {
    manage: boolean;
  };
  view_ips: boolean;
  punishment: IPunishmentPermissions;
  appeals: IAppealsPermissions;
  maps: {
    manage: boolean;
  };
  reports: IReportsPermissions;
  forum: any;
}
