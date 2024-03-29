export interface IGameSettings {
  adminChat: IAdminChatSettings;
  general: IGeneralSettings;
  forum: IForumSettings;
}

export interface IAdminChatSettings {
  active: boolean;
  logs: boolean;
  punishments: boolean;
}

export interface IGeneralSettings {
  gifts: boolean;
  friends: boolean;
  parties: boolean;
  status: boolean;
  hiding: boolean;
  hideType: HideTypes;
}

export enum HideTypes {
  Alone = "Alone", Friendless = "Friendless", Default = "Default"
}

export interface IForumSettings {
  subscribe: boolean;
  quoteAlert: boolean;
}
