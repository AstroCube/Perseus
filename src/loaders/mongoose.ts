import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';

export default async (): Promise<Db> => {
    const connection = await mongoose.connect(config.databaseURL, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false });
    if (config.api.dbDebug) connection.set('debug', true);
    return connection.connection.db;
};
