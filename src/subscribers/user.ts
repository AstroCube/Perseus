import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import { IMailUpdateVerification } from "../interfaces/IUser";
import MailerService from "../services/mailerService";
import { Logger } from "winston";
import { RedisClient } from "redis";

@EventSubscriber()
export default class UserSubscriber {

  @On(events.user.mailUpdate)
  public onUserSignIn(update: IMailUpdateVerification) {
    const Logger: Logger = Container.get('logger');
    const mailer: MailerService = Container.get(MailerService);
    const redis: RedisClient = Container.get('redis');
    try {
      redis.set("verification_" + update.user._id, update.code + "");
      mailer.mailUpdate(update);
    } catch (e) {
      Logger.error("Error while sending verification request %o", e);
      throw e;
    }
  }
}
