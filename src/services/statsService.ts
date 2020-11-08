import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IStats} from "../interfaces/IStats";
import {ResponseError} from "../interfaces/error/ResponseError";

@Service()
export default class StatsService {

  constructor(
    @Inject('statsModel') private statsModel : Models.StatsModel,
    @Inject('logger') private logger: Logger
  ) {}

  public async createStatsDocument(id: string): Promise<IStats> {
    try {
      return await this.statsModel.create({username: id} as IStats);
    } catch (e) {
      this.logger.error('There was an error parsing user auth session %o', e);
      throw e;
    }
  }

  public async get(id: string): Promise<IStats> {
    try {
      const stats: IStats = await this.statsModel.findOne({username: id});
      if (!stats) throw new ResponseError('The requested stats were not found', 404);
      return stats;
    } catch (e) {
      this.logger.error('There was an error parsing user auth session %o', e);
      throw e;
    }
  }

  public async update(stats: IStats): Promise<IStats> {
    try {
      const updatedStats: IStats = await this.statsModel.findOneAndUpdate({username: stats._id}, stats, {new: true});
      if (!updatedStats) throw new ResponseError('The requested stats were not found', 404);
      return updatedStats;
    } catch (e) {
      this.logger.error('There was an error parsing user auth session %o', e);
      throw e;
    }
  }

}
