import {Inject, Service} from 'typedi';
import {IGamemode} from "../interfaces/IGamemode";
import {ResponseError} from "../interfaces/error/ResponseError";
import {IPaginateResult} from "mongoose";

@Service()
export default class GamemodeService {

  constructor(
    @Inject('gamemodeModel') private gamemodeModel: Models.GamemodeModel,
    @Inject('logger') private logger
  ) {}

  public async viewGamemode(id: string): Promise<IGamemode> {
    try {
      const gamemode = await this.gamemodeModel.findById(id);
      if (!gamemode) throw new ResponseError("The requested gamemode was not found", 404);
      return gamemode;
    } catch (e) {
      this.logger.error('There was an error obtaining a gamemode %o', e);
      throw e;
    }
  }

  public async listGamemodes(query?: any, options?: any): Promise<IPaginateResult<IGamemode>> {
    try {
      return await this.gamemodeModel.paginate(query, options);
    } catch (e) {
      this.logger.error('There was an error obtaining a gamemode list %o', e);
      throw e;
    }
  }
  
}
