import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IPerk} from "../interfaces/IPerk";
import {ResponseError} from "../interfaces/error/ResponseError";
import {Document, IPaginateResult} from "mongoose";

@Service()
export default class PerkService {

  constructor(
      @Inject('perkModel') private perkModel : Models.PerkModel,
      @Inject('logger') private logger: Logger
  ) {}

  /**
   * Register new perks document to the database
   * @param model to be created
   */
  public async create(model: IPerk): Promise<IPerk> {
    try {
      return await this.perkModel.create(model);
    } catch (e) {
      this.logger.error('Error while creating a perk: %o', e);
      throw e;
    }
  }

  /**
   * Retrieve id from perks collection
   * @param id to retrieve
   */
  public async get(id : string): Promise<IPerk> {
    try {

      const record: IPerk = await this.perkModel.findById(id);

      if (!record) {
        throw new ResponseError("Perk record not found", 404);
      }

      return record;
    } catch (e) {
      this.logger.error('Error while obtaining a perk: %o', e);
      throw e;
    }
  }

  /**
   * Query a list of perks
   * @param query to be used
   * @param options to be queried
   */
  public async list(query: any, options: any): Promise<IPaginateResult<IPerk>> {
    try {
      return await this.perkModel.paginate(query, options);
    } catch (e) {
      this.logger.error('Error while obtaining a perk: %o', e);
      throw e;
    }
  }

  public async update(id: string, record: any): Promise<IPerk> {
    try {

      const actualPerk: Document & IPerk = await this.perkModel.findById(id);

      if (!actualPerk) {
        throw new ResponseError('Perk not found', 404);
      }

      actualPerk.stored = record;
      return actualPerk.save();
    } catch (e) {
      this.logger.error('Error while updating a perk: %o', e);
      throw e;
    }
  }

}
