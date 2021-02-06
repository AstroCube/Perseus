import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IStats} from "../interfaces/IStats";
import {ResponseError} from "../interfaces/error/ResponseError";
import {IPaginateResult} from "mongoose";

@Service()
export default class StatsService {

  constructor(
      @Inject('statsModel') private statsModel : Models.StatsModel,
      @Inject('logger') private logger: Logger
  ) {}

  /**
   * Register new stats document to the database
   * @param model to be created
   */
  public async create(model: IStats): Promise<IStats> {
    try {
      return await this.statsModel.create(model);
    } catch (e) {
      this.logger.error('Error while creating a stat: %o', e);
      throw e;
    }
  }

  /**
   * Retrieve id from stats collection
   * @param id to retrieve
   */
  public async get(id : string): Promise<IStats> {
    try {

      const record: IStats = await this.statsModel.findById(id);

      if (!record) {
        throw new ResponseError("Stat record not found", 404);
      }

      return record;
    } catch (e) {
      this.logger.error('Error while obtaining a stat: %o', e);
      throw e;
    }
  }

  /**
   * Query a list of stats
   * @param query to be used
   * @param options to be queried
   */
  public async list(query: any, options: any): Promise<IPaginateResult<IStats>> {
    try {
      return await this.statsModel.paginate(query, options);
    } catch (e) {
      this.logger.error('Error while obtaining a stat: %o', e);
      throw e;
    }
  }

  /**
   * Invalidate all the stats registered for a match
   * @param match
   */
  public async invalidate(match : string): Promise<void> {
    try {
      await this.statsModel.deleteMany({match});
    } catch (e) {
      this.logger.error('Error while invalidating match stats %o', e);
      throw e;
    }
  }

}
