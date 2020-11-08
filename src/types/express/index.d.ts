import {Document, FilterQuery, PaginateModel} from 'mongoose';
import {IUser} from '../../interfaces/IUser';
import {IGroup} from "../../interfaces/IGroup";
import {IServer} from "../../interfaces/IServer";
import {ICluster} from "../../interfaces/ICluster";
import {IGamemode} from "../../interfaces/IGamemode";
import {IMatch} from "../../interfaces/IMatch";
import {IMap} from "../../interfaces/IMap";
import {IStats} from "../../interfaces/IStats";
import {IPunishment} from "../../interfaces/IPunishment";
import {IAppeal} from "../../interfaces/IAppeal";
import {IReport} from "../../interfaces/IReport";
import {IForumCategory} from "../../interfaces/forum/IForumCategory";
import {IForum} from "../../interfaces/forum/IForum";
import {ITopic} from "../../interfaces/forum/ITopic";
import {IPost} from "../../interfaces/forum/IPost";
import {IFriend} from "../../interfaces/IFriend";
import {IChannel} from "../../interfaces/channel/IChannel";
import {IChannelMessage} from "../../interfaces/channel/IChannelMessage";
import {IGoal} from "../../interfaces/stats/IGoal";

declare global {
  namespace Express {
    export interface Request {
      authenticated: boolean;
      currentUser: IUser & Document;
      currentServer: IServer & Document;
    }
  }

  namespace Models {

    export type ChannelModel = PaginateModel<IChannel & Document>;
    export type ChannelMessageModel = PaginateModel<IChannelMessage & Document>;

    export type AppealModel = DeletableModel<IAppeal & Document>;
    export type ClusterModel = DeletableModel<ICluster & Document>;
    export type FriendModel = DeletableModel<IFriend & Document>;
    export type ForumModel = DeletableModel<IForum & Document>;
    export type ForumCategoryModel = DeletableModel<IForumCategory & Document>;
    export type GamemodeModel = DeletableModel<IGamemode & Document>;
    export type GoalModel = DeletableModel<IGoal & Document>;
    export type GroupModel = DeletableModel<IGroup & Document>;
    export type MapModel = DeletableModel<IMap & Document>;
    export type MatchModel = DeletableModel<IMatch & Document>;
    export type PostModel = DeletableModel<IPost & Document>;
    export type PunishmentModel = DeletableModel<IPunishment & Document>;
    export type ReportModel = DeletableModel<IReport & Document>;
    export type ServerModel = DeletableModel<IServer & Document>;
    export type StatsModel = DeletableModel<IStats & Document>;
    export type TopicModel = DeletableModel<ITopic & Document>;
    export type UserModel = DeletableModel<IUser & Document>;
  }

  export interface DeletableModel<T> extends PaginateModel<T & Document> {

    delete(query?: FilterQuery<T>);

    restore(query?: FilterQuery<T>);

  }
}
