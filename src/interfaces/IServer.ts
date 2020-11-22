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
  Lobby, Game, Special, Bungee
}
