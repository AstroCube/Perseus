import { Inject, Service } from "typedi";
import { Logger } from "winston";
import { ICluster } from "../interfaces/ICluster";

@Service()
export default class ClusterService {

  constructor(
    @Inject('clusterModel') private clusterModel : Models.ClusterModel,
    @Inject('logger') private logger : Logger
  ) {}

  public async viewCluster(id: string): Promise<ICluster> {
    try {
      const groupRecord = await this.clusterModel.findById(id);
      if (!groupRecord) throw new Error("The cluster was not found.");
      return groupRecord;
    } catch (e) {
      this.logger.error('Error finding the cluster %o', e);
      throw e;
    }
  }

}
