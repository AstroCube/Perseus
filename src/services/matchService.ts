import {Inject, Service} from 'typedi';
import {Logger} from "winston";
import {ResponseError} from "../interfaces/error/ResponseError";
import {IPaginateResult} from "mongoose";
import {IMatch, MatchStatus} from "../interfaces/IMatch";
import {IServer, ServerType} from "../interfaces/IServer";

@Service()
export default class MatchService {

  constructor(
    @Inject('matchModel') private matchModel : Models.MatchModel,
    @Inject('logger') private logger : Logger,
  ) {}

  public async createMatch(match: IMatch, server: IServer): Promise<IMatch> {
    try {

      if (match.map === '') {
        Reflect.deleteProperty(match, 'map');
      }

      console.log(server);

      if (server.type == ServerType.Game) {
        throw new ResponseError('Unauthorized server type', 403);
      }

      const matchRecord = await this.matchModel.create({
        ...match,
        status: MatchStatus.Lobby,
        server: server._id,
        // @ts-ignore
        createdAt: new Date()
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

  public async list(query?: any, options?: any): Promise<IPaginateResult<IMatch>> {
    try {
      return await this.matchModel.paginate(query, options);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async cleanupUnassigned(server: IServer): Promise<void> {
    try {
      const matches: IMatch[] = await this.matchModel.find({server: server._id});
      for (const match of matches) {
        if (match.status === MatchStatus.Lobby) {
          await this.matchModel.findByIdAndDelete(matches);
        } else {
          match.status = MatchStatus.Invalidated;
          await this.update(match);
        }
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

}
