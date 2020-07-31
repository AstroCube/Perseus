import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IUser} from "../interfaces/IUser";
import PunishmentService from "./punishmentService";
import {IReport, IReportAction, IReportCreation, ReportActionType} from "../interfaces/IReport";
import {IReportsPermissions} from "../interfaces/permissions/IReportsPermissions";
import {ResponseError} from "../interfaces/error/ResponseError";
import GroupService from "./groupService";
import {IPermissions} from "../interfaces/IGroup";

@Service()
export default class ReportService {

    constructor(
        @Inject('reportModel') private reportModel : Models.ReportModel,
        @Inject('logger') private logger: Logger,
        private groupService: GroupService
    ) {}

    public async createReport(body: IReportCreation, requester: IUser): Promise<IReport> {
        try {
            if (body.involved.groups.some(g => g.group.staff)) throw new ResponseError("Can not report staff members", 400);

            // @ts-ignore
            const report: IReport = await this.reportModel.create({
                ...body,
                issuer: requester._id,
                involved:  body.involved._id
            } as IReport);

            // @ts-ignore
            return await this.generateAction(
                report._id,
                {
                    type: ReportActionType.Open,
                    // @ts-ignore
                    user: requester._id,
                    createdAt: new Date().toString(),
                    content: ''
                },
                requester
            );
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async getReport(id: string, user: IUser): Promise<IReport> {
        try {
            const manifest = await this.getReportPermissions(user);
            const report: IReport = await this.reportModel.findById(id);
            if (!manifest.manage) {
                ReportService.involvedCheck(report, user);
            }
            return report;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async listReports(query: any, page: number, perPage: number, user: IUser): Promise<IPaginateResult<IReport>> {
        try {
            const manifest = await this.getReportPermissions(user);
            let encapsulation = null;
            if (!manifest.manage) {
                Reflect.deleteProperty(query, 'assigned');
                Reflect.deleteProperty(query, 'involved');
                encapsulation = {$or: [{assigned: {$exists: false}}, {assigned: user._id}]};
                if (!manifest.assign) encapsulation = {involved: user._id};
            }
            return await this.reportModel.paginate({...query.query ? query.query : query, ...encapsulation}, {page, perPage});
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async assign(id: string, user: IUser): Promise<void> {
        try{
            let report: IReport = await this.reportModel.findById(id);
            if (!report) throw new ResponseError('The requested report was not found', 404);

            const permissions: IPermissions = await this.groupService.permissionsManifest(user);
            if (!permissions.reports.assign) throw new ResponseError('You do not have permission to assign reports', 404);

            //@ts-ignore
            report.assigned = user._id;
            this.reportModel.findByIdAndUpdate(id, report);
        } catch (e) {
            this.logger.error("There was an error during report assignation: %o", e);
            throw e;
        }
    }

    public async generateAction(id: string, action: IReportAction, user: IUser, punishmentId?: string): Promise<IReport> {
        let report = await this.reportModel.findById(id);
        const manifest = await this.getReportPermissions(user);
        switch (action.type) {
            case ReportActionType.Open: {
                if (!report.closed) throw new ResponseError("Already opened this report", 400);
                if (!manifest.manage && !manifest.assign) {
                    ReportService.involvedCheck(report, user);
                    if (report.actions.some(a => a.type === ReportActionType.Open) && report.issuer._id.toString() === user._id.toString())
                        throw new ResponseError("Can not re-open your own report", 400);
                }
                report.closed = false;
                break;
            }
            case ReportActionType.Close: {
                if (report.closed) throw new ResponseError("Already closed this report", 400);
                if (!manifest.manage && !manifest.assign) throw new ResponseError("You can not close this report", 400);
                if (!manifest.manage) ReportService.involvedCheck(report, user);
                report.closed = true;
                break;
            }
            case ReportActionType.Comment: {
                if (report.closed) throw new ResponseError("Can not comment while closed", 400);
                if (!manifest.manage) ReportService.involvedCheck(report, user);
                break;
            }
            case ReportActionType.Punish: {
                if (report.punishment) throw new ResponseError("Report already punished", 400);
                if (!manifest.manage && !manifest.assign) throw new ResponseError("You can not punish this player", 403);
                if (!manifest.manage) ReportService.involvedCheck(report, user);
                // @ts-ignore
                report.punishment = punishmentId;
                break;
            }
            default: {
                break;
            }
        }

        report.actions.push(action);
        return await report.save();
    }

    public async getReportPermissions(user: IUser): Promise<IReportsPermissions> {
        try {
            const manage = user.groups.some(g => g.group.web_permissions.reports.manage);
            return {
                manage,
                assign: manage || user.groups.some(g => g.group.web_permissions.reports.assign)
            };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    private static involvedCheck(report: IReport, user: IUser): void {
        if ((report.assigned && report.assigned._id.toString() !== user._id.toString()))
            throw new ResponseError("You can not take actions over this report", 403);
        if (
            report.issuer._id.toString() !== user._id.toString()
        ) throw new ResponseError("You can not take actions over this report", 403);
    }

}
