import { Inject, Service } from "typedi";
import { IAuthenticationResponse, IAuthenticationSession, IServerSwitch } from "../interfaces/ISession";
import { IUser } from "../interfaces/IUser";
import config from '../config';
import { Logger } from "winston";
import * as mongoose from "mongoose";

@Service()
export default class SessionService {

  constructor(
    @Inject('userModel') private userModel : Models.UserModel,
    @Inject('logger') private logger: Logger
  ) {}

  public async authenticateSessionCheck(session: IAuthenticationSession): Promise<IAuthenticationResponse> {

    try {
      const registered: IUser = await this.userModel.findOneAndUpdate({username: session.username}, {session: {online: true}}, {new: true});
      if (registered) return {
        user: registered,
        registered: registered.password !== undefined,
        multiAccount: false
      };

      const multi: IUser = await this.userModel.findOne(
        {address: {number: session.address, primary: true}}
      );
      if (multi) return {
        user: multi,
        registered: true,
        multiAccount: true
      };

      const created: IUser = await this.userModel.create({
        username: session.username,
        display: session.username,
        skin: session.username,
        session: {
          lastSeen: new Date(),
          online: true
        },
        groups: [{
          group: mongoose.Types.ObjectId(config.defaultGroup),
          joined: new Date(),
          comment: null
        }]
      });
      if (!created) throw Error('The user was not created successfully');
      return {
        user: created,
        registered: false,
        multiAccount: false
      };

    } catch (e) {
      this.logger.error('There was an error parsing user auth session %o', e);
    }

  }

  public async serverDisconnect(user: string): Promise<void> {
    try {
      let userRecord = await this.userModel.findById(user);
      userRecord.session.lastSeen = new Date();
      userRecord.session.online = false;
      await userRecord.save();
    } catch (e) {
      this.logger.error('There was an error logging out an user: %o', e);
      throw e;
    }
  }

  public async serverSwitch(switching: IServerSwitch): Promise<void> {
    try {
      if (!switching.server && !switching.lobby) return;
      let userRecord = await this.userModel.findById(switching.user);
      if (switching.server) userRecord.session.lastGame = switching.server;
      if (switching.lobby) userRecord.session.lastLobby = switching.lobby;
      await userRecord.save();
    } catch (e) {
      this.logger.error('There was an error switching servers with user: %o', e);
      throw e;
    }
  }

}
