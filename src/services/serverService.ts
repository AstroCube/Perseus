import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { IServer, IServerAuthResponse } from "../interfaces/IServer";
import { ICluster } from "../interfaces/ICluster";
import ClusterService from "./clusterService";
import jwt from "jsonwebtoken";
import config from "../config";
import { IUser } from "../interfaces/IUser";

@Service()
export default class ServerService {

  constructor(
    @Inject('serverModel') private serverModel : Models.ServerModel,
    @Inject('logger') private logger : Logger,
    private clusterService: ClusterService
  ) {}

  public async loadServer(authorization: IServer): Promise<IServerAuthResponse> {
    try {
      const cluster: ICluster = await this.clusterService.viewCluster(authorization.cluster);
      const serverRecord: IServer = await this.serverModel.create({
        ...authorization,
        cluster: cluster._id,
        players: [],
        matches: []
      });
      if (!serverRecord) throw new Error("Server could not be created");
      return {server: serverRecord, token: ServerService.generateToken(serverRecord._id)};
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getServer(id: string): Promise<IServer> {
    try {
      const server: IServer = await this.serverModel.findById(id);
      if (!server) throw new Error("NotFound");
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
      const serverRecord: IServer = await this.serverModel.findByIdAndUpdate(id, updatable, {new: true});
      if (!serverRecord) throw new Error("Server was not updated correctly.");
      return serverRecord;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async disconnectServer(id: string): Promise<void> {
    try {
      await this.serverModel.findByIdAndDelete(id);
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
