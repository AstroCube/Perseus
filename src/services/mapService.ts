import { Service, Inject } from 'typedi';
import { Logger } from "winston";
import {IMap} from "../interfaces/IMap";
import * as fs from "fs";
import {ResponseError} from "../interfaces/error/ResponseError";
import {IPaginateResult} from "mongoose";
import path from "path";
import {IUser} from "../interfaces/IUser";
import GroupService from "./groupService";
import {IPermissions} from "../interfaces/IGroup";

@Service()
export default class MapService {

  constructor(
    @Inject('mapModel') private mapModel : Models.MapModel,
    @Inject('logger') private logger : Logger,
    private groupService: GroupService
  ) {}

  public async loadMap(map: IMap): Promise<IMap> {
    try {

      /**
       * If the map processed by the Core is not available at the database, will start
       * creating a new record at the database, creating an identifier for the map file inside
       * the folders.
       *
       * In case of already existing map will check if version is higher to generate an update
       * and remove the old files, creating new ones and finally returning the new map.
       *
       * If version is smaller or equals to actual one MUST return the existent version. Keep in
       * mind that Mongo will store only the file name. Will never return the complete file nor
       * custom-made values.
       */

      const existentMap: IMap = await this.mapModel.findOne({identifierName: map.name.toLowerCase()});
      if (!existentMap) return await this.createMap(map);
      if (
          parseInt(map.version.replace(/\./g, ""), 10) >
          parseInt(existentMap.version.replace(/\./g, ""), 10)
      ) await this.updateMap(map);
      return existentMap;
    } catch (e) {
      this.logger.error('There was an error loading a map: %o', e);
      throw e;
    }
  }

  public async getMap(id: string): Promise<IMap> {
    try {
      const map: IMap = await this.mapModel.findById(id);
      if (!map) throw new ResponseError('The requested map does not exist', 404);
      return map;
    } catch (e) {
      this.logger.error('There was an error obtaining a map: %o', e);
      throw e;
    }
  }

  public async listMaps(query: any, page: number, perPage: number): Promise<IPaginateResult<IMap>> {
    try {
      return await this.mapModel.paginate(query, {page, perPage});
    } catch (e) {
      this.logger.error('There was an error listing map: %o', e);
      throw e;
    }
  }

  public async getMapFile(id: string, folder: string, ext: string, user: IUser): Promise<any> {
    try {

      /**
       * For map file: Folder - 'map'. Ext - 'zip'
       * For config file: Folder - 'configuration'. Ext - 'json'
       * For image file: Folder - 'images'. Ext - 'png'
       */

      const map: IMap = await this.mapModel.findById(id);
      const manifest: IPermissions = await this.groupService.permissionsManifest(user);
      if (
          !manifest.maps &&
          map.author.toString() !== user._id.toString() &&
          !map.contributors.some(c => c.contributor.toString() === user._id)
      ) throw new ResponseError('You can not access to the map files.', 404);

      const filePath = './uploads/map/' + folder + '/' + map._id + '.' + ext;
      if (!fs.existsSync(filePath)) throw new ResponseError('The requested file was not found', 404);
      return await path.resolve(filePath);

    } catch (e) {
      this.logger.error('There was an error obtaining a file from a map %o', e);
      throw e;
    }
  }

  private async createMap(map: IMap): Promise<IMap> {
    await MapService.serializeMapFiles(map);
    return await this.mapModel.create({
      ...map,
      file: map._id + '.zip',
      configuration: map._id + '.json',
      image: map._id + '.png'
    } as IMap);
  }

  private async updateMap(map: IMap): Promise<IMap> {
    await MapService.unlinkMapFiles(map);
    await MapService.serializeMapFiles(map);
    return this.mapModel.findByIdAndUpdate(map._id, {
      ...map,
      file: map._id + '.zip',
      configuration: map._id + '.json',
      image: map._id + '.png'
    } as IMap);
  }

  private static async serializeMapFiles(map: IMap): Promise<void> {
    await MapService.serializeDefault(
        map.file.split(";base64,").pop(),
        map._id + '.zip',
        './uploads/map/file/'
    );
    await MapService.serializeDefault(
        map.configuration.split(";base64,").pop(),
        map._id + '.json',
        './uploads/map/configuration/'
    );
    await MapService.serializeDefault(
        map.image.split(";base64,").pop(),
        map._id + '.png',
        './uploads/map/image/'
    );
  }

  private static async unlinkMapFiles(map: IMap): Promise<void> {
    await MapService.unlinkDefault(map.file, './uploads/map/file/');
    await MapService.unlinkDefault(map.configuration, './uploads/map/configuration/');
    await MapService.unlinkDefault(map.image, './uploads/map/image/');
  }

  private static async unlinkDefault(name: string, path: string): Promise<void> {
    await fs.unlinkSync(path + name);
  }

  private static async serializeDefault(base: string, name: string, path: string): Promise<void> {
    await fs.writeFileSync(path + name, base, {encoding: "base64"});
  }


}
