"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
/**
 * Attach server to req.currentServer
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const serverAttachment = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    try {
        const serverModel = typedi_1.Container.get('serverModel');
        const serverRecord = await serverModel.findById(req.token._id);
        if (!serverRecord)
            return res.sendStatus(401);
        req.currentServer = serverRecord.toObject();
        return next();
    }
    catch (e) {
        logger.error(e);
        return next(e);
    }
};
exports.default = serverAttachment;
//# sourceMappingURL=serverAttachment.js.map