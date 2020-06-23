import { Service, Inject } from 'typedi';
import { IGamemode } from "../interfaces/IGamemode";
import {ResponseError} from "../interfaces/error/ResponseError";

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
      return gamemode.toObject();
    } catch (e) {
      this.logger.error('There was an error obtaining a gamemode %o', e);
      throw e;
    }
  }

  public async listGamemodes(): Promise<IGamemode[]> {
    try {
      return this.gamemodeModel.find();
    } catch (e) {
      this.logger.error('There was an error obtaining a gamemode list %o', e);
      throw e;
    }
  }
  
}
