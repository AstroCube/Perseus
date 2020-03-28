import { Service, Inject } from 'typedi';
import { IGamemode } from "../interfaces/IGamemode";

@Service()
export default class GamemodeService {

  constructor(
    @Inject('gamemodeModel') private gamemodeModel: Models.GamemodeModel,
    @Inject('logger') private logger
  ) {}

  public async viewGamemode(id: string): Promise<IGamemode> {
    try {
      const gamemode = await this.gamemodeModel.findById(id);
      if (!gamemode) throw new Error("NotFound");
      return gamemode.toObject();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async listGamemodes(): Promise<IGamemode[]> {
    try {
      return this.gamemodeModel.find();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }
  
}
