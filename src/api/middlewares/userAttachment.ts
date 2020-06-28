import { Container } from 'typedi';
import { Logger } from "winston";

/**
 * Attach user to req.user
 * @param mandatory
 */
const userAttachment = (mandatory? : boolean) => {
  return async (req, res, next) => {
    const logger : Logger = Container.get('logger');
    try {
      if (!req.token) {
        if (mandatory) return res.sendStatus(401);
        req.authenticated = false;
        return next();
      }
      const userModel = Container.get('userModel') as Models.UserModel;
      const userRecord = await userModel.findById(req.token._id);
      if (!userRecord) return res.sendStatus(401);
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
