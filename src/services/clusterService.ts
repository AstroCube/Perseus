import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {ICluster} from "../interfaces/ICluster";
import {ResponseError} from "../interfaces/error/ResponseError";

@Service()
export default class ClusterService {

  constructor(
    @Inject('clusterModel') private clusterModel : Models.ClusterModel,
    @Inject('logger') private logger : Logger
  ) {}

  public async viewCluster(id: string): Promise<ICluster> {
    try {
      const groupRecord = await this.clusterModel.findById(id);
      if (!groupRecord) throw new ResponseError("The cluster was not found", 404);
      return groupRecord;
    } catch (e) {
      this.logger.error('Error finding the cluster %o', e);
      throw e;
    }
  }

}
