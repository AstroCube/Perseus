import { Container } from 'typedi';
import { Logger } from "winston";
import { IUser } from "../interfaces/IUser";
import { Document, PaginateModel } from 'mongoose';

export default class UnregisteredClearSequenceJob {
  public async handler(job, done): Promise<void> {
    const logger: Logger = Container.get('logger');
    const userModel: PaginateModel<IUser & Document> = Container.get('userModel');
    try {
      logger.info('Executing unregistered users cleaning');
      await userModel.deleteMany({password: undefined});
      done();
    } catch (e) {
      logger.error('Error cleaning unregistered users: %o', e);
      done(e);
    }
  }
}
