import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import {ResponseError} from "../interfaces/error/ResponseError";
import {IPaginateResult} from "mongoose";
import {IMatch} from "../interfaces/IMatch";
import {IServer} from "../interfaces/IServer";

@Service()
export default class MatchService {

  constructor(
    @Inject('matchModel') private matchModel : Models.MatchModel,
    @Inject('logger') private logger : Logger,
  ) {}

  public async createMatch(match: IMatch): Promise<IMatch> {
    try {
      const matchRecord = await this.matchModel.create({
        ...match,
        status: 'Waiting'
      });
      if (!matchRecord) throw new ResponseError('There was an error creating the match', 500);
      return matchRecord;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async get(id: string): Promise<IMatch> {
    try {
      const matchRecord = await this.matchModel.findById(id);
      if (!matchRecord) throw new ResponseError('The requested match does not exist', 404);
      return matchRecord;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async update(match: IMatch): Promise<IMatch> {
    try {
      const matchRecord = await this.matchModel.findByIdAndUpdate(match._id, match, {new: true});
      if (!matchRecord) throw new ResponseError('The requested match does not exist', 404);
      return matchRecord;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async list(query: any, page: number, size: number): Promise<IPaginateResult<IMatch>> {
    try {
      return await this.matchModel.paginate(query,
          {
            sort: {createdAt: 1},
            page: page, perPage: size
          });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async cleanupUnassigned(server: IServer): Promise<void> {
    try {
      const matches: IMatch[] = await this.matchModel.find({server: server._id});
      for (const match of matches) {
        if (match.status == 'Waiting') {
          await this.matchModel.findByIdAndDelete(matches);
        } else {
          match.status = 'Invalidated';
          await this.update(match);
        }
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

}
