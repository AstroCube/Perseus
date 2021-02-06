import {IModel} from "./IModel";
import {IGamemode, ISubGamemode} from "./IGamemode";
import {IMatch} from "./IMatch";

export interface IStats extends IModel{
  gameMode: string | IGamemode;
  subGameMode: string | ISubGamemode;
  type: string;
  match: string | IMatch;
  statistic: any;
}
