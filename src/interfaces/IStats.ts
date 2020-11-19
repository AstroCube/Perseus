import {IDungeonsStats} from "./stats/IDungeonsStats";
import {ISkyWarsStats} from "./stats/ISkyWarsStats";
import {ITNTStats} from "./stats/ITNTStats";
import {IModel} from "./IModel";

export interface IStats extends IModel{
  username: string;
  dungeon: IDungeonsStats;
  skyWars: ISkyWarsStats;
  tntGames: ITNTStats;
}
