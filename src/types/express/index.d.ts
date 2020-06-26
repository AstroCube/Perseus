import { Document, PaginateModel } from 'mongoose';
import { IUser } from '../../interfaces/IUser';
import { IGroup } from "../../interfaces/IGroup";
import { IServer } from "../../interfaces/IServer";
import { ICluster } from "../../interfaces/ICluster";
import { IGamemode } from "../../interfaces/IGamemode";
import { IMatch } from "../../interfaces/IMatch";
import { IMap } from "../../interfaces/IMap";
import { IStats } from "../../interfaces/IStats";
import { IPunishment } from "../../interfaces/IPunishment";
import { IAppeal } from "../../interfaces/IAppeal";
import { IReport } from "../../interfaces/IReport";
import { IForumCategory } from "../../interfaces/forum/IForumCategory";
import { IForum } from "../../interfaces/forum/IForum";
import {ITopic} from "../../interfaces/forum/ITopic";
import {IPost} from "../../interfaces/forum/IPost";
import {IFriend} from "../../interfaces/IFriend";

declare global {
  namespace Express {
    export interface Request {
      currentUser: IUser & Document;
      currentServer: IServer & Document;
    }
  }

  namespace Models {
    export type AppealModel = PaginateModel<IAppeal & Document>;
    export type ClusterModel = PaginateModel<ICluster & Document>;
    export type FriendModel = PaginateModel<IFriend & Document>;
    export type ForumModel = PaginateModel<IForum & Document>;
    export type ForumCategoryModel = PaginateModel<IForumCategory & Document>;
    export type GamemodeModel = PaginateModel<IGamemode & Document>;
    export type GroupModel = PaginateModel<IGroup & Document>;
    export type MapModel = PaginateModel<IMap & Document>;
    export type MatchModel = PaginateModel<IMatch & Document>;
    export type PostModel = PaginateModel<IPost & Document>;
    export type PunishmentModel = PaginateModel<IPunishment & Document>;
    export type ReportModel = PaginateModel<IReport & Document>;
    export type ServerModel = PaginateModel<IServer & Document>;
    export type StatsModel = PaginateModel<IStats & Document>;
    export type TopicModel = PaginateModel<ITopic & Document>;
    export type UserModel = PaginateModel<IUser & Document>;
  }
}
