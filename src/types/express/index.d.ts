import { Document, PaginateModel } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IGroup } from "../../interfaces/IGroup";
import { IServer } from "../../interfaces/IServer";
import { ICluster } from "../../interfaces/ICluster";
import { IGamemode } from "../../interfaces/IGamemode";
import { IMatch } from "../../interfaces/IMatch";
import { IMap } from "../../interfaces/IMap";

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
      currentServer: IServer & Document;
    }
  }

  namespace Models {
    export type UserModel = PaginateModel<IUser & Document>;
    export type ServerModel = PaginateModel<IServer & Document>;
    export type MapModel = PaginateModel<IMap & Document>;
    export type ClusterModel = PaginateModel<ICluster & Document>;
    export type GamemodeModel = PaginateModel<IGamemode & Document>;
    export type MatchModel = PaginateModel<IMatch & Document>;
    export type GroupModel = PaginateModel<IGroup & Document>;
  }
}
