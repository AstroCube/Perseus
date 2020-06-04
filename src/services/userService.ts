import { Inject, Service } from "typedi";
import {IMailRegister, IMailUpdateVerification, IPasswordUpdate, IUser} from "../interfaces/IUser";
import { IPaginateResult } from "mongoose";
import { Logger } from "winston";
import argon2 from "argon2";
import { randomBytes } from "crypto";
import { EventDispatcher, EventDispatcherInterface } from "../decorators/eventDispatcher";
import events from "../subscribers/events";
import RedisService from "./redisService";

@Service()
export default class UserService {
  constructor(
    @Inject('userModel') private userModel: Models.UserModel,
    @Inject('logger') private logger: Logger,
    @EventDispatcher() private dispatcher: EventDispatcherInterface,
    private redis: RedisService
  ){}

  public async viewUser(id : string): Promise<IUser> {
    try {
      const userRecord = await this.userModel.findById(id);
      if (!userRecord) throw new Error("NotFound");
      Reflect.deleteProperty(userRecord, 'password');
      Reflect.deleteProperty(userRecord, 'salt');
      return userRecord.toObject();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async listFullUsers(own?: string, id?: boolean): Promise<IUser[]> {
    try {
      let query = {};
      if (!own) query = {_id: {$ne: id}};
      return await this.userModel.find(query).select("_id username skin zdisplay");
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async getUserByName(username : string): Promise<IUser> {
    try {
      const userRecord = await this.userModel.findOne({username: username});
      if (!userRecord) throw new Error("NotFound");
      Reflect.deleteProperty(userRecord, 'password');
      Reflect.deleteProperty(userRecord, 'salt');
      return userRecord.toObject();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async listUsers(page : number): Promise<IPaginateResult<IUser>> {
    try {
      return await this.userModel.paginate({}, { page: page, perPage: 10 });
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updateUser(id : string, updatable : IUser): Promise<IUser> {
    try {
      Reflect.deleteProperty(updatable, 'password');
      Reflect.deleteProperty(updatable, 'salt');
      const userRecord = await this.userModel.findByIdAndUpdate(id, updatable, {new: true});
      if (!userRecord) throw new Error("NotFound");
      Reflect.deleteProperty(userRecord, 'password');
      Reflect.deleteProperty(userRecord, 'salt');
      this.logger.info('Username %o updated successfully', updatable.username);
      return userRecord.toObject();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updatePassword(user: IUser, update: IPasswordUpdate): Promise<Boolean> {
    try {
      /*
        This should be one of the only cases where the model should be called directly in order to get the
        password.

        You should NEVER retrieve the final user a password. In order to get the user you must always use
        viewUser() to prevent passwords leaking.
       */
      const fullQueried: IUser = await this.userModel.findById(user._id);

      const validPassword = await argon2.verify(fullQueried.password, update.actual);
      if (validPassword) {
        const salt = randomBytes(32);
        const hashedPassword = await argon2.hash(update.password, {salt});
        const updated = await this.userModel.findByIdAndUpdate(user._id, {password: hashedPassword, salt: salt});
        if (updated) return true;
      } else {
        throw new Error('Invalid password');
      }
    } catch (e) {
      this.logger.error("There was an error password update: %o", e);
      throw e;
    }
  }

  public async mailUpdateValidation(user: IUser): Promise<Boolean> {
    try {
      const random = Math.floor(Math.pow(10, 6-1) + Math.random() * (Math.pow(6, 6) - Math.pow(6, 6-1) - 1));
      if (await this.redis.existsKey("verification_" + user._id)) throw new Error("Username already verifying");
      this.dispatcher.dispatch(events.user.mailUpdate, {user: user, code: random});
      return true;
    } catch (e) {
      this.logger.error("There was an error creating mail validation: %o", e);
      throw e;
    }
  }

  public async mailUpdate(verification: IMailUpdateVerification): Promise<IUser> {
    try {
      const passphrase = "verification_" + verification.user._id;
      if (!await this.redis.existsKey(passphrase)) { throw new Error("Mail update was not authorized before"); }
      const verifiy = await this.redis.getKey(passphrase);
      if (verifiy !== verification.code + "") { throw new Error("Verification code is invalid"); }
      const updated = await this.userModel.findByIdAndUpdate(verification.user._id, {email: verification.update}, {new: true});
      await this.redis.deleteKey(passphrase);
      Reflect.deleteProperty(updated, 'password');
      Reflect.deleteProperty(updated, 'salt');
      return updated;
    } catch (e) {
      this.logger.error("There was an error updating mail: %o", e);
      throw e;
    }
  }

  public async verifyUser(verification: IMailRegister, host: string): Promise<Boolean> {
    try {
      const userRecord: IUser = await this.viewUser(verification.user);
      if (userRecord.verified) throw new Error("The user has already verified an email");
      const usedEmail: IUser[] = await this.userModel.find({email: verification.email});
      if (usedEmail.length > 0) throw new Error("This email is already in use");
      if (await this.redis.existsKey("mailverify_" + verification.user)) throw new Error("Validation already queried");

      const random = Math.floor((Math.random() * 100) + 54);
      const encodedMail = new Buffer(verification.email).toString('base64');
      const encodedUser = new Buffer(verification.user).toString('base64');
      const link = "https://" + host + "/api/users/verify-code?mail=" + encodedMail + "&user=" + encodedUser + "&id=" + random;

      this.dispatcher.dispatch(events.user.mailVerifyRequest, {user: userRecord, code: random, link: link, email: verification.email});
      this.logger.info('User %o is trying to verify with email ' + verification.email, userRecord.username);
      return true;
    } catch (e) {
      this.logger.error("There was an error verifying mail: %o", e);
      throw e;
    }
  }

  public async verifyCode(verification: IMailRegister): Promise<Boolean> {
    try {
      const key = "mailverify_" + verification.user;
      if (!await this.redis.existsKey(key)) throw new Error("NotFound");
      if (await this.redis.getKey(key) !== verification.code) throw new Error("Invalid verification code");
      let userRecord: IUser = await this.viewUser(verification.user);
      userRecord.verified = true;
      userRecord.email = verification.email;
      await this.updateUser(userRecord._id, userRecord);
      await this.redis.deleteKey(key);
      this.logger.info('User %o successfully verified with email %e', userRecord.username, verification.email);
      return true;
    } catch (e) {
      this.logger.error("There was an error verifying mail: %o", e);
      throw e;
    }
  }

}
