export interface IGameSettings {
  adminChat: IAdminChatSettings;
  general: IGeneralSettings;
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
}
