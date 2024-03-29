import { Container } from 'typedi';
import { Logger } from "winston";
import { IGroup } from "../../interfaces/IGroup";
import {ResponseError} from "../../interfaces/error/ResponseError";

const permissions = (permission : string) => {
  return async (req, res, next) => {
    const logger : Logger = Container.get('logger');
    try {
      const groupModel = Container.get('groupModel') as Models.GroupModel;
      const groupId = await req.currentUser.groups.map((group) => {
        return group.group;
      });
      const accessible : IGroup[] = await groupModel.find({ _id: {$in: groupId},
        $or: [
          {["web_permissions." + permission]: true},
          {admin: true}
        ]
      });
      if (!accessible || accessible.length <= 0) throw new ResponseError("You are not allowed to do this", 404);
      return next();
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  };
};

export default permissions;
