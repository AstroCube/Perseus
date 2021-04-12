import {Container} from 'typedi';
import {Logger} from "winston";
import ChannelService from "../services/channel/channelService";
import ServerService from "../services/serverService";

export default class ServerPing {
  public async handler(job, done): Promise<void> {

    const Logger: Logger = Container.get('logger');
    const service: ServerService = Container.get(ServerService);

    try {
      Logger.debug('Starting server pinging')
      await service.executePing();
      done();
    } catch (e) {
      Logger.error('Error while pinging servers: %o', e);
      done(e);
    }
  }
}
