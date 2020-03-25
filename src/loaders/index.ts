import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import redisLoader from './redis';
import jobsLoader from './jobs';
import mailLoader from './mailer';
import Logger from './logger';
import config from '../config';
import { TransportOptions } from "nodemailer";


export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    Logger.info('MongoDB successfully connected');

    const redisClient = await redisLoader(config.redis);
    redisClient.on("error", (err) => {
       Logger.error("Error with redis connection: %o", err);
    });
    Logger.info('Redis successfully connected');

    const mailer = await mailLoader({
        host: config.emails.host,
        port: config.emails.port,
        secure: config.emails.secure,
        auth: {
            user: config.emails.auth.user,
            pass: config.emails.auth.pass
        }
    } as TransportOptions);
    Logger.info('Mailer successfully loaded');

    const userModel = {
        name: 'userModel',
        model: require('../models/user').default
    };
    const groupModel = {
        name: 'groupModel',
        model: require('../models/group').default
    };

    const { agenda } = await dependencyInjectorLoader({
        mailer,
        redisClient,
        mongoConnection,
        models: [
          userModel,
          groupModel
        ],
    });
    Logger.info('Dependency injector loaded');

    await jobsLoader({ agenda });
    Logger.info('Jobs loaded');

    await expressLoader({ app: expressApp });
    Logger.info('Express loaded');
};
