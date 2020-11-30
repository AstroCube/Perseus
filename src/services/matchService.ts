import {Inject, Service} from 'typedi';
import {Logger} from "winston";
import {ResponseError} from "../interfaces/error/ResponseError";
import {IPaginateResult, Schema, Types} from "mongoose";
import {IMatch, IMatchAssignable, IMatchTeam, MatchStatus} from "../interfaces/IMatch";
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

      if (server.type !== ServerType.Game) {
        throw new ResponseError('Unauthorized server type', 403);
      }

      const matchRecord = await this.matchModel.create({
        ...match,
        status: MatchStatus.Lobby,
        server: server._id,
        // @ts-ignore
        createdAt: new Date().toISOString()
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

      delete match.pending;
      delete match.spectators;
      delete match.teams;

      const matchRecord = await this.matchModel.findByIdAndUpdate(match._id, match, {new: true});
      if (!matchRecord) throw new ResponseError('The requested match does not exist', 404);
      return matchRecord;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async assignSpectator(user: string, match: string, join: boolean): Promise<void> {
    try {

      const matchRecord: IMatch = await this.matchModel.findById(match);

      if (!matchRecord) {
        throw new ResponseError('This match does not exists', 404);
      }

      const assigned = matchRecord.spectators.map(m => m.toString()).includes(match);

      if (join) {

        if (assigned) {
          throw new ResponseError('User already assigned to match', 400);
        }

        await this.matchModel.findByIdAndUpdate(matchRecord._id, {spectators: {$push: user}} as any);
      } else {

        if (!assigned) {
          throw new ResponseError('User not assigned to match', 400);
        }

        await this.matchModel.findByIdAndUpdate(matchRecord._id, {spectators: {$pull: user}} as any);
      }
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async assignMatchTeams(teams: IMatchTeam[], match: string): Promise<void> {
    try {
      const matchRecord: IMatch = await this.matchModel.findById(match);

      if (!matchRecord) {
        throw new ResponseError('This match does not exists', 404);
      }

      if (matchRecord.teams.length > 0) {
        throw new ResponseError('You can not update teams after registered', 400);
      }

      await this.matchModel.findByIdAndUpdate(matchRecord._id, {teams, pending: []});

    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async assignPending(pending: IMatchAssignable, match: string): Promise<void> {
    try {
      const matchRecord: IMatch = await this.matchModel.findById(match);

      if (!matchRecord) {
        throw new ResponseError('This match does not exists', 404);
      }

      // Hack in order to allow ObjectId query
      pending.involved.push(pending.responsible);
      const involved: Types.ObjectId[] = [];
      pending.involved.forEach(i => involved.push(new Types.ObjectId(i)));

      const pendingMatch: IMatch[] = await this.matchModel.find(
          {
            $or: [
              {pending: {responsible: {$in: involved}}},
              {pending: {involved: {$in: involved}}}
            ]
          } as any
      );

      if (pendingMatch.length > 0) {
        throw new ResponseError('You can not be assigned to a match more than once', 400);
      }

      await this.matchModel.findByIdAndUpdate(matchRecord._id, {pending: {$push: pending}} as any);

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
