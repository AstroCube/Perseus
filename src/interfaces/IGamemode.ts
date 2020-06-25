import {IModel} from "./IModel";

export interface IGamemode extends IModel{
  name: string;
  lobby: string;
  navigator: string;
  slot: number;
  subTypes: ISubGamemode[];
}

export interface ISubGamemode extends IModel {
  name: string;
  selectableMap: boolean;
  minPlayers: number;
  maxPlayers: number;
  permission: string;
  group: string;
}
