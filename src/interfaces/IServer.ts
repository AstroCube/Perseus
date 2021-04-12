import {IModel} from "./IModel";

export interface IServer extends IModel {
  slug: string;
  type: ServerType;
  gameMode: string;
  subGameMode: string;
  maxRunning: number;
  maxTotal: number;
  cluster: string;
}

export enum ServerType {
  Lobby = "Lobby", Game = "Game", Special = "Special", Bungee = "Bungee"
}

export interface IServerPing {
  server: string;
  action: Action
}

export enum Action {
  Request = "Request", Confirm = "Confirm"
}
