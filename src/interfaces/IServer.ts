import { IModel } from "./IModel";

export interface IServer extends IModel {
  slug: string;
  type: ServerType;
  gamemode: string;
  subGamemode: string;
  maxRunning: number;
  maxTotal: number;
  players: string[];
  cluster: string;
  matches: string[];
}

export enum ServerType {
  Lobby, Game, Special, Bungee
}

export interface IServerAuthResponse {
  server: IServer;
  token: string;
}
