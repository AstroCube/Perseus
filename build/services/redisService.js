"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const redis_1 = require("redis");
const util_1 = require("util");
let RedisService = class RedisService {
    constructor(redis) {
        this.redis = redis;
    }
    async getKey(s) {
        if (!this.existsKey(s))
            throw new Error("The requested key does not exists");
        const getAsync = util_1.promisify(this.redis.get).bind(this.redis);
        return await getAsync(s);
    }
    async setKey(key, value) {
        const setAsync = util_1.promisify(this.redis.set).bind(this.redis);
        return await setAsync(key, value);
    }
    async existsKey(s) {
        const existAsync = util_1.promisify(this.redis.exists).bind(this.redis);
        return await existAsync(s);
    }
    async setKeyExpiration(s, e) {
        const expireAsync = util_1.promisify(this.redis.expire).bind(this.redis);
        return await expireAsync(s, e);
    }
    async deleteKey(s) {
        if (!this.existsKey(s))
            throw new Error("The requested key does not exists");
        const deleteAsync = util_1.promisify(this.redis.del).bind(this.redis);
        return await deleteAsync(s);
    }
};
RedisService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('redis')),
    __metadata("design:paramtypes", [redis_1.RedisClient])
], RedisService);
exports.default = RedisService;
//# sourceMappingURL=redisService.js.map