import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import config from '../config';
import argon2 from 'argon2';
import * as geoIp from 'geoip-lite';
import { IServerAuthentication, IUser, IUserIP } from "../interfaces/IUser";
import events from "../subscribers/events";
import { EventDispatcher, EventDispatcherInterface } from "../decorators/eventDispatcher";
import { randomBytes } from "crypto";
import StatsService from "./statsService";
import {ResponseError} from "../interfaces/error/ResponseError";

@Service()
export default class AuthService {

  constructor(
    @Inject('userModel') private userModel : Models.UserModel,
    @EventDispatcher() private dispatcher: EventDispatcherInterface,
    @Inject('logger') private logger,
    private stats: StatsService
  ) {}

  public async signIn(email: string, password: string): Promise<{ user: IUser; token: string }> {
    try {
      const userRecord = await this.userModel.findOne({ email });
      if (!userRecord) {
        throw new ResponseError('User not registered', 404);
      }

      const validPassword = await argon2.verify(userRecord.password, password);
      if (validPassword) {
        const token = AuthService.generateToken(userRecord._id);
        const user = userRecord.toObject();
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');
        return { user, token };
      } else {
        throw new ResponseError('The information provided is incorrect', 403);
      }
    } catch (e) {
      this.logger.error('There was an error logging user to the website: %o', e);
      throw e;
    }
  }

  public async serverLogin(login: IServerAuthentication): Promise<Boolean> {
    try {
      const userRecord = await this.userModel.findById(login.user);
      if (!userRecord) throw new ResponseError('The requested user does not exists', 404);
      const validPassword = await argon2.verify(userRecord.password, login.password);
      if (validPassword) {
        const lookup = geoIp.lookup(login.address);
        const address: IUserIP = {
          number: login.address,
          country: lookup.country || "US",
          primary: false
        };
        this.dispatcher.dispatch(events.user.serverLogin, {user: userRecord, address});
        return true;
      } else {
        throw new ResponseError('The provided password was not valid', 403);
      }
    } catch (e) {
      this.logger.error('There was an error logging user to the server: %o', e);
      throw e;
    }
  }

  public async serverRegister(register: IServerAuthentication): Promise<IUser> {
    try {
      const salt = randomBytes(32);
      const hashedPassword = await argon2.hash(register.password, {salt});
      const registeredUser = await this.userModel.findByIdAndUpdate(register.user,
        {
          password: hashedPassword,
          salt: salt.toString(),
          $push: {
            address: {
              number: register.address,
              country: geoIp.lookup(register.address).country,
              primary: true
            }
          }
        }
      );
      await this.stats.createStatsDocument(registeredUser._id);
      Reflect.deleteProperty(registeredUser, 'password');
      Reflect.deleteProperty(registeredUser, 'salt');
      return registeredUser;
    } catch (e) {
      this.logger.error('There was an error registering user to the server: %o', e);
      throw e;
    }
  }

  private static generateToken(user : string) {
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 60);
    return jwt.sign(
      {
        _id: user,
        exp: exp.getTime() / 1000
      },
      config.jwtSecret
    );
  }
}
