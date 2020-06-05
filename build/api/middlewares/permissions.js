"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const permissions = (permission) => {
    return async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        try {
            const groupModel = typedi_1.Container.get('groupModel');
            const groupId = await req.currentUser.group.map((group) => {
                return group.id;
            });
            const accessible = await groupModel.find({ _id: { $in: groupId },
                $or: [
                    { ["permissions." + permission]: true },
                    { admin: true }
                ]
            });
            if (!accessible || accessible.length <= 0)
                throw new Error("UnauthorizedError");
            return next();
        }
        catch (e) {
            logger.error(e);
            return next(e);
        }
    };
};
exports.default = permissions;
//# sourceMappingURL=permissions.js.map