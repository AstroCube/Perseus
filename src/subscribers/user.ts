import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import {IMailUpdateVerification, IMailVerifyRequest, IUser, IUserIP} from "../interfaces/IUser";
import MailerService from "../services/mailerService";
import { Logger } from "winston";
import RedisService from "../services/redisService";
import UserService from "../services/userService";

@EventSubscriber()
export default class UserSubscriber {

  @On(events.user.mailUpdate)
  public onUserMailUpdate(update: IMailUpdateVerification) {
    const Logger: Logger = Container.get('logger');
    const mailer: MailerService = Container.get(MailerService);
    const redis: RedisService = Container.get(RedisService);
    try {
      redis.setKey("verification_" + update.user._id, update.code + "");
      mailer.mailUpdate(update);
    } catch (e) {
      Logger.error("Error while sending verification request %o", e);
      throw e;
    }
  }

  @On(events.user.serverLogin)
  public async onServerLogin(login: {user: IUser, address: IUserIP}) {
    const Logger: Logger = Container.get('logger');
    const service: UserService = Container.get(UserService);
    try {
      if (!login.user.address.some(address => address.number === login.address.number)) {
        login.user.address.push(login.address);
        await service.updateUser(login.user._id, login.user);
      }
    } catch (e) {
      Logger.error("Error while executing login event %o", e);
      throw e;
    }
  }

  @On(events.user.mailVerifyRequest)
  public async onMailVerifyRequest(verification: IMailVerifyRequest) {
    const Logger: Logger = Container.get('logger');
    const mailer: MailerService = Container.get(MailerService);
    const redis: RedisService = Container.get(RedisService);
    try {
      const key = "mailverify_" + verification.user._id;
      console.log(key);
      await redis.setKey(key, verification.code);
      await redis.setKeyExpiration(key, 600);
      console.log(redis.getKey(key));
      await mailer.mailVerify(verification);
    } catch (e) {
      Logger.error("Error while sending verification request %o", e);
      throw e;
    }
  }

}
