import { Container } from 'typedi';
import { Logger } from "winston";
import {ResponseError} from "../../interfaces/error/ResponseError";

const userAttachment = (optional?: boolean) => {
  return async (req, res, next) => {
    const logger : Logger = Container.get('logger');
    try {
      console.log("Bebecita ahora");
      if (!req.token) {
        console.log("Bebecita not authenticated");
        req.authenticated = false;
        if (!optional) throw new ResponseError('You have not provided an authentication token.', 403);
        next();
      }
      const userModel = Container.get('userModel') as Models.UserModel;
      const userRecord = await userModel.findById(req.token._id);
      console.log("Bebecita finding model");
      if (!userRecord) return res.sendStatus(401);
      const currentUser = userRecord.toObject();
      Reflect.deleteProperty(currentUser, 'password');
      Reflect.deleteProperty(currentUser, 'salt');
      req.authenticated = true;
      req.currentUser = currentUser;
      next();
    } catch (e) {
      logger.error(e);
      next(e);
    }
  };
}

export default userAttachment;
