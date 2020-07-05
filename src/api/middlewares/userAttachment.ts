import { Container } from 'typedi';
import { Logger } from "winston";

const userAttachment = async (optional?: boolean) => {
  return async (req, res, next) => {
    const logger : Logger = Container.get('logger');
    try {
      const userModel = Container.get('userModel') as Models.UserModel;
      const userRecord = await userModel.findById(req.token._id);
      const currentUser = userRecord.toObject();
      Reflect.deleteProperty(currentUser, 'password');
      Reflect.deleteProperty(currentUser, 'salt');
      req.authenticated = true;
      req.currentUser = currentUser;
      return next();
    } catch (e) {
      logger.error(e);
      return next(e);
    }
  };
};

export default userAttachment;
