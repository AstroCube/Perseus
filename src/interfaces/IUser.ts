import { IModel } from "./IModel";
import { Languages } from "./user/Languages";
import { IPublicInfo } from "./user/IPublicInfo";
import { IGameSettings } from "./user/IGameSettings";
import { IGroup } from "./IGroup";

export interface IUser extends IModel{
  username: string;
  display: string;
  email: string;
  password: string;
  salt: string;
  groups: IUserGroup[];
  skin: string;
  session: IGameSession;
  verified: true;
  level: number;
  experience: number;
  address: IUserIP[];
  discord: IUserDiscord;
  language: Languages;
  publicInfo: IPublicInfo;
  settings: IGameSettings;
}

export interface IUserGroup {
  group: IGroup;
  joined: string;
  comment: string;
}

export interface IGameSession {
  lastSeen: string;
  lastGame: string;
  lastLobby: string;
  premium: boolean;
}

export interface IUserIP {
  number: string;
  country: string;
  primary: boolean;
}

export interface IUserDiscord {
  id: string;
  access: string;
  refresh: string;
  stamp: string;
}

export interface IPasswordUpdate {
  actual: string;
  password: string;
}
