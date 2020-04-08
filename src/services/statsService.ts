import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IStats } from "../interfaces/IStats";

@Service()
export default class StatsService {

  constructor(
    @Inject('statsModel') private statsModel : Models.StatsModel,
    @Inject('logger') private logger: Logger
  ) {}

  public async createStatsDocument(id: string): Promise<IStats> {
    try {
      return await this.statsModel.create({username:  id});
    } catch (e) {
      this.logger.error('There was an error parsing user auth session %o', e);
    }
  }

}
