import { IModel } from "./IModel";
import {IServer} from "./IServer";

export interface IMatch extends IModel {
  map: string;
  server?: IServer | string;
  teams: IMatchTeam[];
  winner: string[];
  status: any;
  gamemode: string;
  subGamemode: string;
}

export interface IMatchTeam {
  name: string;
  members: IMatchMember[];
  color: string;
}

export interface IMatchMember {
  user: string;
  joinedAt: string;
}
