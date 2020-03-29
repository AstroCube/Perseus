import { Container } from 'typedi';
import { Logger } from "winston";
import { IUser } from "../interfaces/IUser";
import { Document, PaginateModel } from 'mongoose';

export default class UnregisteredClearSequenceJob {
  public async handler(job, done): Promise<void> {
    const Logger: Logger = Container.get('logger');
    const userModel: PaginateModel<IUser & Document> = Container.get('userModel');
    try {
      Logger.info('Executing unregistered users cleaning');
      await userModel.deleteMany({password: undefined});
      done();
    } catch (e) {
      Logger.error('Error cleaning unregistered users: %o', e);
      done(e);
    }
  }
}
