import {Container} from 'typedi';
import {Logger} from "winston";
import ChannelService from "../services/channel/channelService";
import ServerService from "../services/serverService";
import SessionService from "../services/sessionService";

export default class UserPing {
  public async handler(job, done): Promise<void> {

    const Logger: Logger = Container.get('logger');
    const service: SessionService = Container.get(SessionService);

    try {
      Logger.debug('Starting user pinging');
      await service.executePing();
      done();
    } catch (e) {
      Logger.error('Error while pinging sessions: %o', e);
      done(e);
    }
  }
}
