"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
/**
 * Attach user to req.user
 * @param {*} req Express req Object
 * @param {*} res  Express res Object
 * @param {*} next  Express next Function
 */
const userAttachment = async (req, res, next) => {
    const logger = typedi_1.Container.get('logger');
    try {
        const userModel = typedi_1.Container.get('userModel');
        const userRecord = await userModel.findById(req.token._id);
        if (!userRecord)
            return res.sendStatus(401);
        const currentUser = userRecord.toObject();
        Reflect.deleteProperty(currentUser, 'password');
        Reflect.deleteProperty(currentUser, 'salt');
        req.currentUser = currentUser;
        return next();
    }
    catch (e) {
        logger.error(e);
        return next(e);
    }
};
exports.default = userAttachment;
//# sourceMappingURL=userAttachment.js.map