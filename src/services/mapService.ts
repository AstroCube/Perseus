import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import {IMap} from "../interfaces/IMap";

@Service()
export default class MapService {

  constructor(
    @Inject('mapModel') private mapModel : Models.MapModel,
    @Inject('logger') private logger : Logger
  ) {}

  /**
   * Create map with provided data from route.
   * @param map to be created with provided data
   */
  public create(map: IMap): Promise<IMap> {
    try {
      return null;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

}
