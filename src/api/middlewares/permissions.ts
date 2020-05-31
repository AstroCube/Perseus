import { Container } from 'typedi';
import { Logger } from "winston";
import { IGroup } from "../../interfaces/IGroup";

const permissions = (permission : string) => {
  return async (req, res, next) => {
    const logger : Logger = Container.get('logger');
    try {
      const groupModel = Container.get('groupModel') as Models.GroupModel;
      const groupId = await req.currentUser.group.map((group: { id: any; }) => {
        return group.id;
      });
      const accessible : IGroup[] = await groupModel.find({ _id: {$in: groupId},
        $or: [
          {["permissions." + permission]: true},
          {admin: true}
        ]
      });
      if (!accessible || accessible.length <= 0) throw new Error("UnauthorizedError");
      return next();
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  };
};

export default permissions;
