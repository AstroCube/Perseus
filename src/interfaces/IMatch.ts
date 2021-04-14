import {IModel} from "./IModel";
import {IServer} from "./IServer";
import {IUser} from "./IUser";

export interface IMatch extends IModel {
  map: string;
  server?: IServer | string;
  teams: IMatchTeam[];
  spectators: string[];
  pending: IMatchAssignable[];
  winner: string[];
  status: MatchStatus;
  private: boolean;
  privatizedBy: string | IUser;
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


export interface ISpectatorAssignMessage extends IMatchActionMessage{
  user: string;
  join: boolean;
}

export interface IMatchActionMessage {
  match: string;
}