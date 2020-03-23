import { Inject, Service } from "typedi";
import { IPasswordUpdate, IUser } from "../interfaces/IUser";
import { IPaginateResult } from "mongoose";
import { Logger } from "winston";
import argon2 from "argon2";
import { randomBytes } from "crypto";

@Service()
export default class UserService {
  constructor(
    @Inject('userModel') private userModel : Models.UserModel,
    @Inject('logger') private logger : Logger
  ){}

  public async viewUser(id : string): Promise<IUser> {
    try {
      const userRecord = await this.userModel.findById(id);
      if (!userRecord) throw new Error("User was not registered.");
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
      if (!userRecord) throw new Error("User was not registered.");
      Reflect.deleteProperty(userRecord, 'password');
      Reflect.deleteProperty(userRecord, 'salt');
      return userRecord.toObject();
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public async updatePassword(id: string, update: IPasswordUpdate): Promise<Boolean> {
    const userRecord = await this.userModel.findById(id);
    if (!userRecord) throw new Error('User not registered');
    const validPassword = await argon2.verify(userRecord.password, update.actual);
    if (validPassword) {
      const salt = randomBytes(32);
      const hashedPassword = await argon2.hash(update.password, {salt});
      const updated = this.userModel.findByIdAndUpdate(id, {password: hashedPassword, salt: salt});
      if (updated) return true;
    } else {
      throw new Error('Invalid password');
    }
  }

}
