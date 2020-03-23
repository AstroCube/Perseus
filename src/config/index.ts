import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("Could not find .env file");
}

export default {
    port: parseInt(process.env.PORT, 10),
    databaseURL: process.env.MONGODB_URI,
    jwtSecret: process.env.JWT_SECRET,
    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },
    agenda: {
        dbCollection: process.env.AGENDA_DB_COLLECTION,
        pooltime: process.env.AGENDA_POOL_TIME,
        concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
    },
    agendash: {
        user: 'agendash',
        password: '123456'
    },
    api: {
        prefix: '/api',
    },
    emails: {
        apiKey: '',
        domain: ''
    },
    redis: {
        port: 6379,
        host: '127.0.0.1',
        auth_pass: ''
    }
};
