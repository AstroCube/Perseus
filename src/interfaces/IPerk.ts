import {IGamemode, ISubGamemode} from "./IGamemode";
import {IUser} from "./IUser";

export interface IPerk {
    gameMode: string | IGamemode;
    subGameMode?: string | ISubGamemode;
    responsible: string | IUser;
    type: string;
    stored: any;
}