import expressLoader from './express';
import dependencyInjectorLoader from './dependencyInjector';
import mongooseLoader from './mongoose';
import redisLoader from './redis';
import jobsLoader from './jobs';
import Logger from './logger';
import config from '../config';

export default async ({ expressApp }) => {
    const mongoConnection = await mongooseLoader();
    Logger.info('MongoDB successfully connected');
    const redisClient = await redisLoader(config.redis);
    Logger.info('Redis successfully connected');

    const userModel = {
        name: 'userModel',
        model: require('../models/user').default
    };
    const groupModel = {
        name: 'groupModel',
        model: require('../models/group').default
    };

    const { agenda } = await dependencyInjectorLoader({
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
