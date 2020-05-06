import { Service, Inject } from 'typedi';
import {IPunishment, PunishmentType} from "../interfaces/IPunishment";
import {IPaginateResult} from "mongoose";
import {IGroup} from "../interfaces/IGroup";

@Service()
export default class PunishmentService {

  constructor(
    @Inject('gamemodeModel') private punishmentModel: Models.PunishmentModel,
    @Inject('logger') private logger
  ) {}

  public async createPunishment(punishment: IPunishment): Promise<IPunishment> {
    try {
      let model = await this.punishmentModel.create({
        ...punishment
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
      const punishment = await this.punishmentModel.findById(id);
      if (!punishment) throw new Error("Queried punishment does not exist.");
      return punishment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async listPunishments(page : number): Promise<IPaginateResult<IPunishment>> {
    try {
      return await this.punishmentModel.paginate({}, { page: page, perPage: 10 });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async listUserPunishments(id: string, active: boolean,  type?: PunishmentType): Promise<IPunishment[]> {
    try {
      const punishment = await this.punishmentModel.find({punished: id, active: active, type: type});
      if (!punishment) throw new Error("Queried punishment does not exist.");
      return punishment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getLastPunishment(id: string, active: boolean,  type?: PunishmentType): Promise<IPunishment[]> {
    try {
      const punishment = await this.punishmentModel.find({punished: id, active: active, type: type});
      if (!punishment) throw new Error("Queried punishment does not exist.");
      return punishment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
}
