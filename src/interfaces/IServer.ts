import {IModel} from "./IModel";

export interface IServer extends IModel {
  slug: string;
  type: ServerType;
  gamemode: string;
  subGamemode: string;
  maxRunning: number;
  maxTotal: number;
  cluster: string;
}

export enum ServerType {
  Lobby, Game, Special, Bungee
}
