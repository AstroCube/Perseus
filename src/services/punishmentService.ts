import {Inject, Service} from 'typedi';
import {Logger} from "winston";
import {IPunishment, PunishmentType} from "../interfaces/IPunishment";
import {IPaginateResult} from "mongoose";
import GroupService from "./groupService";
import {IUser} from "../interfaces/IUser";
import {IPermissions} from "../interfaces/IGroup";
import {IReport, IReportAction, ReportActionType} from "../interfaces/IReport";
import ReportService from "./reportService";

@Service()
export default class PunishmentService {

  constructor(
    @Inject('punishmentModel') private punishmentModel: Models.PunishmentModel,
    @Inject('logger') private logger: Logger,
    private reportService: ReportService,
    private groupService: GroupService
  ) {}

  public async createPunishment(punishment: IPunishment, issuer?: IUser, report?: string): Promise<IPunishment> {
    try {

      let reportRecord: IReport;
      if (report) {
        reportRecord = await this.reportService.getReport(report, issuer);
        if (!reportRecord) throw new Error("Report to link was not found");
      }

      let match = undefined;
      if (punishment.match) match = punishment.match._id;

      if (issuer) {
        const permissions: IPermissions = await this.groupService.permissionsManifest(issuer);
        if (!permissions.punishments.manage) {
          if (punishment.type === PunishmentType.Warn && !permissions.punishments.create.warn) throw new Error("UnauthorizedError");
          if (punishment.type === PunishmentType.Kick && !permissions.punishments.create.kick) throw new Error("UnauthorizedError");
          if (
              (punishment.type === PunishmentType.Ban && punishment.expires === -1) &&
              !permissions.punishments.create.ban
          ) throw new Error("UnauthorizedError");
          if (
              (punishment.type === PunishmentType.Ban && punishment.expires !== -1) &&
              !permissions.punishments.create.temp_ban
          ) throw new Error("UnauthorizedError");
        }
      }

      let model: IPunishment = await this.punishmentModel.create({
        ...punishment,
        //@ts-ignore
        issuer: punishment.issuer._id,
        //@ts-ignore
        punished: punishment.punished._id,
        match: match
      });

      if (!model) throw new Error("There was an error creating a punishments.");
      if (reportRecord) await this.reportService.generateAction(
          reportRecord._id,
          {
            type: ReportActionType.Punish,
            user: issuer,
            createdAt: new Date().toISOString()
          } as IReportAction,
          issuer,
          model._id
      );

      return model;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getPunishment(id: string): Promise<IPunishment> {
    try {
      const punishment: IPunishment = await this.punishmentModel.findById(id);
      if (!punishment) throw new Error("Queried punishment does not exist.");
      return punishment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async listPunishments(query: any, page: number, size: number): Promise<IPaginateResult<IPunishment>> {
    try {
      return await this.punishmentModel.paginate(query,
          {
            sort: {createdAt: 1},
            page: page, perPage: size
          });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getLastPunishment(query: any): Promise<IPunishment> {
    try {
      return await this.punishmentModel.findOne(query).sort("createdAt");
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updatePunishment(punishment: IPunishment): Promise<IPunishment> {
    try {
      const updatedPunishment: IPunishment = await this.punishmentModel.findByIdAndUpdate(punishment._id, punishment, {new: true});
      if (!updatedPunishment) throw new Error("Queried punishment does not exist");
      return punishment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
}
