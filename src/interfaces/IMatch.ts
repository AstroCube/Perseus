import {IModel} from "./IModel";
import {IServer} from "./IServer";

export interface IMatch extends IModel {
  map: string;
  server?: IServer | string;
  teams: IMatchTeam[];
  spectators: string[];
  pending: IMatchAssignable[];
  winner: string[];
  status: MatchStatus;
  gamemode: string;
  subGamemode: string;
  query: any;
  requestedBy: string;
}

export enum MatchStatus {
  Preparing = "Preparing", Lobby = "Lobby", Starting = "Starting", Running = "Running", Finished = "Finished", Invalidated = "Invalidated"
}

export interface IMatchTeam {
  name: string;
  members: IMatchMember[];
  color: string;
}

export interface IMatchMember {
  user: string;
  joinedAt: string;
  active: boolean;
}

export interface IMatchAssignable {
  responsible: string;
  involved: string[];
}
