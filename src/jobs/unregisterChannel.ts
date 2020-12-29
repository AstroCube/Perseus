import { Container } from 'typedi';
import { Logger } from "winston";
import ChannelService from "../services/channel/channelService";

export default class UnregisterChannel {
  public async handler(job, done): Promise<void> {

    const logger: Logger = Container.get('logger');
    const service: ChannelService = Container.get(ChannelService);

    try {
      await service.delete(job.attrs.data.channel);
      done();
    } catch (e) {
      logger.error('Error cleaning unregistered users: %o', e);
      done(e);
    }
  }
}
