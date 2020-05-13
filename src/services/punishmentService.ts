import {Inject, Service} from 'typedi';
import {Logger} from "winston";
import {IPunishment} from "../interfaces/IPunishment";

@Service()
export default class PunishmentService {

  constructor(
    @Inject('gamemodeModel') private punishmentModel: Models.PunishmentModel,
    @Inject('logger') private logger: Logger
  ) {}

  public async createPunishment(punishment: IPunishment): Promise<IPunishment> {
    try {

      let match = null;
      if (punishment.match !== null) match = punishment.match._id;

      let model: IPunishment = await this.punishmentModel.create({
        ...punishment,
        issuer: punishment.issuer._id,
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
      const punishment: IPunishment = await this.punishmentModel.findById(id);
      if (!punishment) throw new Error("Queried punishment does not exist.");
      return punishment;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async listPunishments(query: any): Promise<IPunishment[]> {
    try {
      return await this.punishmentModel.find(query);
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
