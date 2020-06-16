import {IModel} from "./IModel";
import {IPunishment} from "./IPunishment";
import {IUser} from "./IUser";

export interface IReport extends IModel {
    punishment: IPunishment;
    registeredAddress: string;
    issuer: IUser;
    involved: IUser;
    assigned: IUser;
    actions: IReportAction[];
    rule: string;
    evidence: string;
    miscellaneous: string;
    closed: boolean;
}

export interface IReportAction {
    type: ReportActionType;
    user: IUser;
    createdAt: string;
    content: string;
}

export enum ReportActionType {
    Open =  'Open', Close = 'Close', Punish = 'Punish', Comment = 'Comment'
}

export interface IReportCreation {
    issuer: IUser;
    involved: IUser;
    rule: string;
    evidence: string;
    miscellaneous: string;
    registeredAddress: string;
}
