import {IUser} from "./IUser";
import {IMatch} from "./IMatch";
import {IModel} from "./IModel";

export interface IPunishment extends IModel {
    type: PunishmentType;
    issuer: IUser;
    punished: IUser;
    server: string;
    match: IMatch;
    lastIp: string;
    silent: boolean;
    reason: string;
    evidence: string;
    expires: number;
    automatic: boolean;
    appealed: boolean;
    active: boolean
}

export enum PunishmentType {
    Warn = "Warn", Kick = "Kick", Ban = "Ban"
}
