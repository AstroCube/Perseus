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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const event_dispatch_1 = require("event-dispatch");
const events_1 = __importDefault(require("./events"));
const mailerService_1 = __importDefault(require("../services/mailerService"));
const redisService_1 = __importDefault(require("../services/redisService"));
const userService_1 = __importDefault(require("../services/userService"));
let UserSubscriber = class UserSubscriber {
    async onUserMailUpdate(update) {
        const Logger = typedi_1.Container.get('logger');
        const mailer = typedi_1.Container.get(mailerService_1.default);
        const redis = typedi_1.Container.get(redisService_1.default);
        try {
            await redis.setKey("verification_" + update.user._id, update.code + "");
            await mailer.mailUpdate(update);
        }
        catch (e) {
            Logger.error("Error while sending verification request %o", e);
            throw e;
        }
    }
    async onServerLogin(login) {
        const Logger = typedi_1.Container.get('logger');
        const service = typedi_1.Container.get(userService_1.default);
        try {
            if (!login.user.address.some(address => address.number === login.address.number)) {
                login.user.address.push(login.address);
                await service.updateUser(login.user._id, login.user);
            }
        }
        catch (e) {
            Logger.error("Error while executing login event %o", e);
            throw e;
        }
    }
    async onMailVerifyRequest(verification) {
        const Logger = typedi_1.Container.get('logger');
        const mailer = typedi_1.Container.get(mailerService_1.default);
        const redis = typedi_1.Container.get(redisService_1.default);
        try {
            const key = "mailverify_" + verification.user._id;
            await redis.setKey(key, verification.code);
            await redis.setKeyExpiration(key, 600);
            await mailer.mailVerify(verification);
        }
        catch (e) {
            Logger.error("Error while sending verification request %o", e);
            throw e;
        }
    }
};
__decorate([
    event_dispatch_1.On(events_1.default.user.mailUpdate),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriber.prototype, "onUserMailUpdate", null);
__decorate([
    event_dispatch_1.On(events_1.default.user.serverLogin),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriber.prototype, "onServerLogin", null);
__decorate([
    event_dispatch_1.On(events_1.default.user.mailVerifyRequest),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserSubscriber.prototype, "onMailVerifyRequest", null);
UserSubscriber = __decorate([
    event_dispatch_1.EventSubscriber()
], UserSubscriber);
exports.default = UserSubscriber;
//# sourceMappingURL=user.js.map