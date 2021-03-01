import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import {IMap, IMapCreation, IMapVersion} from "../interfaces/IMap";
import {ResponseError} from "../interfaces/error/ResponseError";
import {IPaginateResult} from "mongoose";
import {StorageService} from "./storageService";
import {IStorageManifest} from "../interfaces/IStorageManifest";

@Service()
export default class MapService {

  constructor(
    @Inject('mapModel') private mapModel : Models.MapModel,
    @Inject('logger') private logger : Logger,
    private storageService: StorageService
  ) {}

  /**
   * Create map with provided data from route.
   * @param map to be created with provided data
   */
  public async create(map: IMapCreation): Promise<IMap> {
    try {

      const mapFile: IStorageManifest = await this.storageService.writeFile(map.file);
      const image: IStorageManifest = await this.storageService.writeFile(map.image);
      const configuration: IStorageManifest = await this.storageService.writeFile(map.configuration);

      const mapModel: IMap = await this.mapModel.create(
          {
            ...map as any,
            versions: [{
              file: mapFile.fid,
              image: image.fid,
              configuration: configuration.fid,
              version: map.version
            }]
          }
      );

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
      if (!mapModel) throw new ResponseError('The requested map was not found', 404);
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
      return await this.mapModel.paginate(query, {...options, select: {versions: 0}});
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

      Reflect.deleteProperty(map, 'versions');
      Reflect.deleteProperty(map, 'rating');

      const currentMap: IMap = await this.mapModel.findById(map._id);

      if (!currentMap)
        throw new ResponseError('There was an error creating the map', 500);

      return await this.mapModel.findByIdAndUpdate(map._id, map);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * Update certain map from database
   * @param map to update
   * @param version to be added
   */
  public async updateFile(map: string, version: IMapVersion): Promise<IMap> {
    try {

      const currentMap: IMap = await this.mapModel.findById(map);

      const file: IStorageManifest = await this.storageService.writeFile(version.file);
      const image: IStorageManifest = await this.storageService.writeFile(version.image);
      const configuration: IStorageManifest = await this.storageService.writeFile(version.configuration);

      if (!currentMap) {
        throw new ResponseError('The requested map was not found', 404);
      }

      return await this.mapModel.findByIdAndUpdate(map,
          // @ts-ignore
          {versions: {$push: {file, image, configuration, version: version.version}}}
          );
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  /**
   * Return a certain image buffer.
   * @param map
   * @param version
   */
  public async getImage(map: string, version?: string): Promise<Buffer>  {
    try {
      return this.storageService.readFile((await this.getRequestedVersion(map, version)).image);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getConfiguration(map: string, version?: string): Promise<Buffer>  {
    try {
      return this.storageService.readFile((await this.getRequestedVersion(map, version)).configuration);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getFile(map: string, version?: string): Promise<Buffer>  {
    try {
      return this.storageService.readFile((await this.getRequestedVersion(map, version)).file);
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

  private async getRequestedVersion(map: string, version?: string): Promise<IMapVersion> {
    const currentMap: IMap = await this.mapModel.findById(map);
    if (!currentMap) {
      throw new ResponseError('The requested map was not found', 404);
    }

    const versions = currentMap.versions.sort((a, b) =>
        // tslint:disable-next-line:radix
        parseInt(b.version.replace(/\./g, "")) - parseInt(a.version.replace(/\./g, "")));

    if (version) {

      if (!versions.some(v => v.version === version)) {
        throw new ResponseError('The requested map version was not found', 404);
      }

      return versions.find(s => s.version === version);
    }

    return versions[0];
  }

}

