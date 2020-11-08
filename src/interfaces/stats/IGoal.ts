import {IModel} from "../IModel";
import {IUser} from "../IUser";
import {IMatch} from "../IMatch";

export interface IGoal extends IModel {
    user : string | IUser,
    match : string | IMatch,
    gamemode: string,
    subGamemode: string,
    objective : string,
    meta : any
}