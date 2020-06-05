"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv_1.default.config();
if (!envFound) {
    throw new Error("Could not find .env file");
}
exports.default = {
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
        frontend: 'https://www.seocraft.net',
        dbDebug: true
    },
    emails: {
        host: 'smtp.mi.com.co',
        port: 465,
        secure: true,
        auth: {
            user: 'contacto@seocraft.net',
            pass: 'OlaAdios24'
        }
    },
    redis: {
        port: 6379,
        host: process.env.REDIS_HOST,
        auth_pass: process.env.REDIS_PASS
    },
    defaultGroup: '5b52b2048284865491b1f56a'
};
//# sourceMappingURL=index.js.map