import {IUser} from "./IUser";

export interface IAuthenticationSession {
  username: string;
  address: string;
}

export interface IAuthenticationResponse {
  user: IUser;
  registered: boolean;
  multiAccount: boolean;
}

export interface IServerSwitch {
  user: string;
  server: string;
  lobby: string;
}

export interface ISessionPing {
  user: string;
  action: PingAction;
}

export enum PingAction {
  Request = "Request", Response = "Response", Disconnect = "Disconnect"
}
