import {IPaginateResult} from "mongoose";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IUser} from "../interfaces/IUser";
import PunishmentService from "./punishmentService";
import {IReport, IReportAction, IReportCreation, ReportActionType} from "../interfaces/IReport";
import {IReportsPermissions} from "../interfaces/permissions/IReportsPermissions";

@Service()
export default class ReportService {

    constructor(
        @Inject('reportModel') private reportModel : Models.ReportModel,
        @Inject('logger') private logger: Logger,
        private punishmentService: PunishmentService
    ) {}

    public async createReport(body: IReportCreation, requester: IUser): Promise<IReport> {
        try {
            console.log(body);

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
                query.assigned = undefined;
                query.involved = undefined;
                encapsulation = {assigned: {$exists: false}};
                if (!manifest.assign) encapsulation = {involved: true};
            }
            return await this.reportModel.paginate({...query, ...encapsulation}, {page, perPage});
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async generateAction(id: string, action: IReportAction, user: IUser, reportId?: string): Promise<IReport> {
        let report = await this.reportModel.findById(id);
        const manifest = await this.getReportPermissions(user);
        switch (action.type) {
            case ReportActionType.Open: {
                if (!report.closed) throw new Error("Already opened");
                if (!manifest.manage && !manifest.assign) throw new Error("UnauthorizedError");
                if (!manifest.manage) ReportService.involvedCheck(report, user);
                report.closed = false;
                break;
            }
            case ReportActionType.Close: {
                if (report.closed) throw new Error("Already closed");
                if (!manifest.manage && !manifest.assign) throw new Error("UnauthorizedError");
                if (!manifest.manage) ReportService.involvedCheck(report, user);
                report.closed = true;
                break;
            }
            case ReportActionType.Comment: {
                if (report.closed) throw new Error("Can not comment while closed");
                if (!manifest.manage) ReportService.involvedCheck(report, user);
                break;
            }
            case ReportActionType.Punish: {
                if (report.punishment) throw new Error("Report already punished");
                if (!manifest.manage && !manifest.assign) throw new Error("UnauthorizedError");
                if (!manifest.manage) ReportService.involvedCheck(report, user);
                // @ts-ignore
                report.punishment = reportId;
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
        if ((report.assigned && report.assigned._id.toString() !== user._id.toString())) throw new Error("UnauthorizedError");
        if (
            report.involved._id.toString() !== user._id.toString() &&
            report.issuer._id.toString() !== user._id.toString()
        ) throw new Error("UnauthorizedError");
    }

}
