import { Service, Inject } from 'typedi';
import { IUser } from '../interfaces/IUser';
import {IGroup, IPermissions, IStaffGroup} from "../interfaces/IGroup";
import { IPaginateResult } from "mongoose";
import { Logger } from "winston";
import dotty = require('dotty');
import {ResponseError} from "../interfaces/error/ResponseError";

@Service()
export default class GroupService {

  constructor(
    @Inject('userModel') private userModel : Models.UserModel,
    @Inject('groupModel') private groupModel : Models.GroupModel,
    @Inject('logger') private logger : Logger
  ) {}

  public async createGroup(group : IGroup, user : IUser): Promise<IGroup> {
    try {
      const groupRecord = await this.groupModel.create({
        ...group,
        createdBy: user._id
      } as IGroup);
      if (!groupRecord) throw new ResponseError("There was an error creating a group.", 500);
      return groupRecord;
    } catch (e) {
      this.logger.error('There was an error creating a group: %o', e);
      throw e;
    }
  }

  public async viewGroup(id : string): Promise<IGroup> {
    try {
      const groupRecord = await this.groupModel.findById(id);
      if (!groupRecord) throw new ResponseError("Queried group does not exist.", 404);
      return groupRecord;
    } catch (e) {
      this.logger.error('There was an error obtaining a group: %o', e);
      throw e;
    }
  }

  public async listGroup(page : number): Promise<IPaginateResult<IGroup>> {
    try {
      return await this.groupModel.paginate({}, { page: page, perPage: 10 });
    } catch (e) {
      this.logger.error('There was an error listing groups %o', e);
      throw e;
    }
  }

  public async updateGroup(id : string, updatable : IGroup): Promise<IGroup> {
    try {
      const groupRecord = await this.groupModel.findByIdAndUpdate(id, updatable, {new: true});
      if (!groupRecord) throw new ResponseError("Queried group does not exist.", 404);
      return groupRecord;
    } catch (e) {
      this.logger.error('There was an error updating a group: %o', e);
      throw e;
    }
  }

  public async addUser(id : string, group : string): Promise<IUser> {
    try {
      const userRecord = await this.userModel.findByIdAndUpdate(id, {$push: {group: {id: group, joined: new Date()}}}, {new: true});
      if (!userRecord) throw new ResponseError("Queried user does not exist.", 500);
      Reflect.deleteProperty(userRecord, 'password');
      Reflect.deleteProperty(userRecord, 'salt');
      return userRecord;
    } catch (e) {
      this.logger.error('There was an error adding a user to a group: %o', e);
      throw e;
    }
  }

  public async getStaffBoard(): Promise<IStaffGroup[]> {
    try {
      let staffGroups: IStaffGroup[] = [];

      const groupList: IGroup[] = await this.groupModel.find({staff: true});
      for (const group of groupList) {
        staffGroups.push({group, user: await this.userModel
              //@ts-ignore
              .find({groups: {group: group._id}})
              .select({password: -1, salt: -1})});
      }

      return staffGroups;
    } catch (e) {
      this.logger.error('Error while obtaining staff list: %o', e);
      throw e;
    }
  }

  public async removeUser(id : string, group : string): Promise<IUser> {
    try {
      const userRecord = await this.userModel.findByIdAndUpdate(id, {$pull: {group: {id: group}}}, {new: true});
      if (!userRecord) throw new ResponseError("Queried user does not exist.", 404);
      Reflect.deleteProperty(userRecord, 'password');
      Reflect.deleteProperty(userRecord, 'salt');
      return userRecord;
    } catch (e) {
      this.logger.error('There was an error removing a user from a group: %o', e);
      throw e;
    }
  }

  public async permissionsManifest(user: IUser): Promise<IPermissions> {
    try {
      let clearManifest = {};
      user.groups.map((group) => {
        dotty.deepKeys(group.group.web_permissions, {leavesOnly: true}).forEach((key) => {
          if (dotty.get(group.group.web_permissions, key))
            dotty.put(clearManifest, key, true);
        });
      });
      return clearManifest as IPermissions;
    } catch (e) {
      this.logger.error('There was an error obtaining permissions manifest: %o', e);
      throw e;
    }
  }

}
