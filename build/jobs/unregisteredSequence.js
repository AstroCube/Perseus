"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
class UnregisteredClearSequenceJob {
    async handler(job, done) {
        const Logger = typedi_1.Container.get('logger');
        const userModel = typedi_1.Container.get('userModel');
        try {
            Logger.info('Executing unregistered users cleaning');
            await userModel.deleteMany({ password: undefined });
            done();
        }
        catch (e) {
            Logger.error('Error cleaning unregistered users: %o', e);
            done(e);
        }
    }
}
exports.default = UnregisteredClearSequenceJob;
//# sourceMappingURL=unregisteredSequence.js.map