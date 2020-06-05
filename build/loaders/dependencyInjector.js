"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const logger_1 = __importDefault(require("./logger"));
const agenda_1 = __importDefault(require("./agenda"));
exports.default = ({ mailer, redisClient, mongoConnection, models }) => {
    try {
        models.forEach(m => {
            typedi_1.Container.set(m.name, m.model);
            logger_1.default.info(m.name + ' injected correctly');
        });
        const agendaInstance = agenda_1.default({ mongoConnection });
        typedi_1.Container.set('redis', redisClient);
        typedi_1.Container.set('agendaInstance', agendaInstance);
        typedi_1.Container.set('mailClient', mailer);
        typedi_1.Container.set('logger', logger_1.default);
        logger_1.default.info('Agenda injected into container');
        return { agenda: agendaInstance };
    }
    catch (e) {
        logger_1.default.error('Error on dependency injector loader: %o', e);
        throw e;
    }
};
//# sourceMappingURL=dependencyInjector.js.map