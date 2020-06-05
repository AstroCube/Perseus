"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("./express"));
const dependencyInjector_1 = __importDefault(require("./dependencyInjector"));
const mongoose_1 = __importDefault(require("./mongoose"));
const redis_1 = __importDefault(require("./redis"));
const jobs_1 = __importDefault(require("./jobs"));
const mailer_1 = __importDefault(require("./mailer"));
const logger_1 = __importDefault(require("./logger"));
const config_1 = __importDefault(require("../config"));
require("./events");
exports.default = async ({ expressApp }) => {
    const mongoConnection = await mongoose_1.default();
    logger_1.default.info('MongoDB successfully connected');
    const redisClient = await redis_1.default(config_1.default.redis);
    redisClient.on("error", (err) => {
        logger_1.default.error("Error with redis connection: %o", err);
    });
    logger_1.default.info('Redis successfully connected');
    const mailer = await mailer_1.default({
        host: config_1.default.emails.host,
        port: config_1.default.emails.port,
        secure: config_1.default.emails.secure,
        auth: {
            user: config_1.default.emails.auth.user,
            pass: config_1.default.emails.auth.pass
        }
    });
    logger_1.default.info('Mailer successfully loaded');
    const clusterModel = {
        name: 'clusterModel',
        model: require('../models/cluster').default
    };
    const gamemodeModel = {
        name: 'gamemodeModel',
        model: require('../models/gamemode').default
    };
    const groupModel = {
        name: 'groupModel',
        model: require('../models/group').default
    };
    const mapModel = {
        name: 'mapModel',
        model: require('../models/map').default
    };
    const matchModel = {
        name: 'matchModel',
        model: require('../models/match').default
    };
    const punishmentModel = {
        name: 'punishmentModel',
        model: require('../models/punishment').default
    };
    const serverModel = {
        name: 'serverModel',
        model: require('../models/server').default
    };
    const statsModel = {
        name: 'statsModel',
        model: require('../models/stats').default
    };
    const userModel = {
        name: 'userModel',
        model: require('../models/user').default
    };
    const { agenda } = await dependencyInjector_1.default({
        mailer,
        redisClient,
        mongoConnection,
        models: [
            clusterModel,
            gamemodeModel,
            groupModel,
            mapModel,
            matchModel,
            punishmentModel,
            serverModel,
            statsModel,
            userModel
        ],
    });
    logger_1.default.info('Dependency injector loaded');
    await jobs_1.default({ agenda });
    logger_1.default.info('Jobs loaded');
    await express_1.default({ app: expressApp });
    logger_1.default.info('Express loaded');
};
//# sourceMappingURL=index.js.map