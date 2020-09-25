import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import {IMap} from "../interfaces/IMap";
import {ResponseError} from "../interfaces/error/ResponseError";
import {IPaginateResult} from "mongoose";
import {IMatch} from "../interfaces/IMatch";

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
  public async create(map: IMap): Promise<IMap> {
    try {
      const mapModel: IMap = await this.mapModel.create(map);
      if (!mapModel) throw new ResponseError('There was an error creating the map', 500);
      return mapModel;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * Retrieve certain map with an ID
   * @param id to be retrieved
   */
  public async get(id: string): Promise<IMap> {
    try {
      const mapModel: IMap = await this.mapModel.findById(id);
      if (!mapModel) throw new ResponseError('The requested map was not found', 500);
      return mapModel;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * Obtain a certain list of maps conditioned by certain options
   * @param query to be found
   * @param options to be conditioned
   */
  public async list(query?: any, options?: any): Promise<IPaginateResult<IMap>> {
    try {
      return await this.mapModel.paginate(query, {...options, select: {file: -1, configuration: -1}});
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * Update certain map from database
   * @param map to update
   */
  public async update(map: IMap): Promise<IMap> {
    try {

      const currentMap: IMap = await this.mapModel.findById(map._id);

      if (
          parseInt(map.version.replace(/\./g, ""), 10) <=
          parseInt(currentMap.version.replace(/\./g, ""), 10)
      ) {
        throw new ResponseError('You can not update to a lower version this map', 400);
      }

      return await this.mapModel.findByIdAndUpdate(map._id, map);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * Soft deletion of a certain map
   * @param id of map to be deleted
   */
  public async delete(id: string): Promise<void> {
    try {
      await this.mapModel.findByIdAndDelete(id);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

}

