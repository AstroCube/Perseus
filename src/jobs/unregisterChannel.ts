import { Container } from 'typedi';
import { Logger } from "winston";
import { IUser } from "../interfaces/IUser";
import { Document, PaginateModel } from 'mongoose';
import {IChannel} from "../interfaces/channel/IChannel";
import ChannelService from "../services/channel/channelService";

export default class UnregisterChannel {
  public async handler(job, done): Promise<void> {

    const Logger: Logger = Container.get('logger');
    const service: ChannelService = Container.get(ChannelService);

    try {
      await service.delete(job.attrs.data.channel);
      done();
    } catch (e) {
      Logger.error('Error cleaning unregistered users: %o', e);
      done(e);
    }
  }
}
