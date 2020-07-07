import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IServer, IServerAuthResponse } from "../interfaces/IServer";
import { ICluster } from "../interfaces/ICluster";
import ClusterService from "./clusterService";
import jwt from "jsonwebtoken";
import config from "../config";
import {ResponseError} from "../interfaces/error/ResponseError";
@Service()
export default class ServerService {

  constructor(
    @Inject('serverModel') private serverModel : Models.ServerModel,
    @Inject('logger') private logger : Logger,
    private clusterService: ClusterService
  ) {}

  public async loadServer(authorization: IServer): Promise<IServerAuthResponse> {
    try {
      Reflect.deleteProperty(authorization, '_id');
      const cluster: ICluster = await this.clusterService.viewCluster(authorization.cluster);
      const serverRecord: IServer = await this.serverModel.create({
        ...authorization,
        cluster: cluster._id
      });
      this.logger.info("Successfully loaded server %o to the database with name " + serverRecord.slug, serverRecord._id);
      if (!serverRecord) throw new ResponseError("Server could not be created", 500);
      return {server: serverRecord, token: ServerService.generateToken(serverRecord._id)};
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getServer(id: string): Promise<IServer> {
    try {
      const server: IServer = await this.serverModel.findById(id);
      if (!server) throw new ResponseError("Server could not be found", 404);
      return server;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getServersByQuery(query?: any): Promise<IServer[]> {
    try {
      if (!query) return await this.serverModel.find();
      return await this.serverModel.find(query);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateServer(id : string, updatable : IServer): Promise<IServer> {
    try {
      Reflect.deleteProperty(updatable, 'cluster');
      Reflect.deleteProperty(updatable, 'slug');
      Reflect.deleteProperty(updatable, 'type');
      const serverRecord: IServer = await this.serverModel.findByIdAndUpdate(id, updatable, {new: true});
      if (!serverRecord) throw new ResponseError("Server was not updated correctly.", 500);
      return serverRecord;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async disconnectServer(id: string): Promise<void> {
    try {
      await this.serverModel.findByIdAndDelete(id);
      this.logger.info("Successfully disconnected server %o", id);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private static generateToken(server: string) {
    return jwt.sign(
      {
        _id: server
      },
      config.jwtSecret
    );
  }

}
