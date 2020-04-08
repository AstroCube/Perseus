import { IDungeonsStats } from "./stats/IDungeonsStats";
import { ISkyWarsStats } from "./stats/ISkyWarsStats";
import { ITNTStats } from "./stats/ITNTStats";

export interface IStats {
  username: string;
  dungeon: IDungeonsStats;
  skyWars: ISkyWarsStats;
  tntGames: ITNTStats;
}
