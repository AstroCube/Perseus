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
