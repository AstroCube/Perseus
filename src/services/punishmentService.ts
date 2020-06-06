import {Inject, Service} from 'typedi';
import {Logger} from "winston";
import {IPunishment, PunishmentType} from "../interfaces/IPunishment";
import {IPaginateResult} from "mongoose";
import GroupService from "./groupService";
import {IUser} from "../interfaces/IUser";
import {IPermissions} from "../interfaces/IGroup";

@Service()
export default class PunishmentService {

  constructor(
    @Inject('punishmentModel') private punishmentModel: Models.PunishmentModel,
    @Inject('logger') private logger: Logger,
    private groupService: GroupService
  ) {}

  public async createPunishment(punishment: IPunishment, issuer?: IUser): Promise<IPunishment> {
    try {

      let match = undefined;
      if (punishment.match) match = punishment.match._id;

      if (issuer) {
        const permissions: IPermissions = await this.groupService.permissionsManifest(punishment.issuer);
        this.logger.debug(permissions);
        if (!permissions.punishment.manage) {
          if (punishment.type === PunishmentType.Warn && !permissions.punishment.create.warn) throw new Error("UnauthorizedError");
          if (punishment.type === PunishmentType.Kick&& !permissions.punishment.create.kick) throw new Error("UnauthorizedError");
          if (
              (punishment.type === PunishmentType.Ban && punishment.expires === -1) &&
              !permissions.punishment.create.ban
          ) throw new Error("UnauthorizedError");
          if (
              (punishment.type === PunishmentType.Ban && punishment.expires !== -1) &&
              !permissions.punishment.create.temp_ban
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
      return model;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getPunishment(id: string): Promise<IPunishment> {
    try {
      const punishment: IPunishment = await this.punishmentModel.findById(id)
          .populate('issuer punished match')
          .select("-punished.password -punished.salt -issuer.password -issuer.salt");
      if (!punishment) throw new Error("Queried punishment does not exist.");
      return punishment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async listPunishments(query: any, page?: number, size?: number): Promise<IPaginateResult<IPunishment>> {
    try {
      let finalPage = 1; if (page) finalPage = page;
      let perPage = -1;  if (size) perPage = size;
      return await this.punishmentModel.paginate(query,
          {
            sort: {createdAt: 1},
            page: finalPage, perPage: parseInt(String(perPage)),
            populate: [
                'issuer',
                'punished',
                'match'
            ],
            select: "-punished.password -punished.salt -issuer.password -issuer.salt"
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
      const updatedPunishment: IPunishment = await this.punishmentModel.findByIdAndUpdate(punishment._id, punishment);
      if (!updatedPunishment) throw new Error("Queried punishment does not exist");
      return punishment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
}
