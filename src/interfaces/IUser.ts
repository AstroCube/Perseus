import { IModel } from "./IModel";
import { IPublicInfo } from "./user/IPublicInfo";
import { IGameSettings } from "./user/IGameSettings";
import { IGroup } from "./IGroup";
import exp from "constants";

export interface IUser extends IModel {
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
  language: string;
  publicInfo: IPublicInfo;
  settings: IGameSettings;
}

export interface IUserGroup {
  group: IGroup;
  joined: string;
  comment: string;
}

export interface IGameSession {
  lastSeen: Date;
  online: boolean;
  lastGame: string;
  lastLobby: string;
  authorize: AuthorizationMethod;
}

export enum AuthorizationMethod {
  Password = "Password", Premium = "Premium"
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

export interface IMailUpdateVerification {
  user: IUser;
  code: number;
  update: string;
}

export interface IMailRegister {
  user: string;
  email: string;
  code: string;
}

export interface IMailVerifyRequest {
  user: IUser;
  code: string;
  email: string;
  link: string;
}

export interface IServerAuthentication {
  user: string;
  password: string;
  address: string;
}
