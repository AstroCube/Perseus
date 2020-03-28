import { Container } from "typedi";
import { Logger } from "winston";

/**
 * Attach server to req.currentServer
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const serverAttachment = async (req, res, next) => {
  const logger : Logger = Container.get('logger');
  try {
    const serverModel = Container.get('serverModel') as Models.ServerModel;
    const serverRecord = await serverModel.findById(req.token._id);
    if (!serverRecord) return res.sendStatus(401);
    req.currentUser = serverRecord.toObject();
    return next();
  } catch (e) {
    logger.error(e);
    return next(e);
  }
};

export default serverAttachment;
