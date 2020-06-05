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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const argon2_1 = __importDefault(require("argon2"));
const crypto_1 = require("crypto");
const eventDispatcher_1 = require("../decorators/eventDispatcher");
const events_1 = __importDefault(require("../subscribers/events"));
const redisService_1 = __importDefault(require("./redisService"));
let UserService = class UserService {
    constructor(userModel, logger, dispatcher, redis) {
        this.userModel = userModel;
        this.logger = logger;
        this.dispatcher = dispatcher;
        this.redis = redis;
    }
    async viewUser(id) {
        try {
            const userRecord = await this.userModel.findById(id);
            if (!userRecord)
                throw new Error("NotFound");
            Reflect.deleteProperty(userRecord, 'password');
            Reflect.deleteProperty(userRecord, 'salt');
            return userRecord.toObject();
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async listFullUsers(own, id) {
        try {
            let query = {};
            if (!own)
                query = { _id: { $ne: id } };
            return await this.userModel.find(query).select("_id username skin zdisplay");
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async getUserByName(username) {
        try {
            const userRecord = await this.userModel.findOne({ username: username });
            if (!userRecord)
                throw new Error("NotFound");
            Reflect.deleteProperty(userRecord, 'password');
            Reflect.deleteProperty(userRecord, 'salt');
            return userRecord.toObject();
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async listUsers(page) {
        try {
            return await this.userModel.paginate({}, { page: page, perPage: 10 });
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async updateUser(id, updatable) {
        try {
            Reflect.deleteProperty(updatable, 'password');
            Reflect.deleteProperty(updatable, 'salt');
            const userRecord = await this.userModel.findByIdAndUpdate(id, updatable, { new: true });
            if (!userRecord)
                throw new Error("NotFound");
            Reflect.deleteProperty(userRecord, 'password');
            Reflect.deleteProperty(userRecord, 'salt');
            this.logger.info('Username %o updated successfully', updatable.username);
            return userRecord.toObject();
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async updatePassword(user, update) {
        try {
            /*
              This should be one of the only cases where the model should be called directly in order to get the
              password.
      
              You should NEVER retrieve the final user a password. In order to get the user you must always use
              viewUser() to prevent passwords leaking.
             */
            const fullQueried = await this.userModel.findById(user._id);
            const validPassword = await argon2_1.default.verify(fullQueried.password, update.actual);
            if (validPassword) {
                const salt = crypto_1.randomBytes(32);
                const hashedPassword = await argon2_1.default.hash(update.password, { salt });
                const updated = await this.userModel.findByIdAndUpdate(user._id, { password: hashedPassword, salt: salt.toString() });
                if (updated)
                    return true;
            }
            else {
                throw new Error('Invalid password');
            }
        }
        catch (e) {
            this.logger.error("There was an error password update: %o", e);
            throw e;
        }
    }
    async mailUpdateValidation(user) {
        try {
            const random = Math.floor(Math.pow(10, 6 - 1) + Math.random() * (Math.pow(6, 6) - Math.pow(6, 6 - 1) - 1));
            if (await this.redis.existsKey("verification_" + user._id))
                throw new Error("Username already verifying");
            this.dispatcher.dispatch(events_1.default.user.mailUpdate, { user: user, code: random });
            return true;
        }
        catch (e) {
            this.logger.error("There was an error creating mail validation: %o", e);
            throw e;
        }
    }
    async mailUpdate(verification) {
        try {
            const passphrase = "verification_" + verification.user._id;
            if (!await this.redis.existsKey(passphrase)) {
                throw new Error("Mail update was not authorized before");
            }
            const verifiy = await this.redis.getKey(passphrase);
            if (verifiy !== verification.code + "") {
                throw new Error("Verification code is invalid");
            }
            const updated = await this.userModel.findByIdAndUpdate(verification.user._id, { email: verification.update }, { new: true });
            await this.redis.deleteKey(passphrase);
            Reflect.deleteProperty(updated, 'password');
            Reflect.deleteProperty(updated, 'salt');
            return updated;
        }
        catch (e) {
            this.logger.error("There was an error updating mail: %o", e);
            throw e;
        }
    }
    async verifyUser(verification, host) {
        try {
            const userRecord = await this.viewUser(verification.user);
            if (userRecord.verified)
                throw new Error("The user has already verified an email");
            const usedEmail = await this.userModel.find({ email: verification.email });
            if (usedEmail.length > 0)
                throw new Error("This email is already in use");
            if (await this.redis.existsKey("mailverify_" + verification.user))
                throw new Error("Validation already queried");
            const random = Math.floor((Math.random() * 100) + 54);
            const encodedMail = new Buffer(verification.email).toString('base64');
            const encodedUser = new Buffer(verification.user).toString('base64');
            const link = "https://" + host + "/api/users/verify-code?mail=" + encodedMail + "&user=" + encodedUser + "&id=" + random;
            this.dispatcher.dispatch(events_1.default.user.mailVerifyRequest, { user: userRecord, code: random, link: link, email: verification.email });
            this.logger.info('User %o is trying to verify with email ' + verification.email, userRecord.username);
            return true;
        }
        catch (e) {
            this.logger.error("There was an error verifying mail: %o", e);
            throw e;
        }
    }
    async verifyCode(verification) {
        try {
            const key = "mailverify_" + verification.user;
            if (!await this.redis.existsKey(key))
                throw new Error("NotFound");
            if (await this.redis.getKey(key) !== verification.code)
                throw new Error("Invalid verification code");
            let userRecord = await this.viewUser(verification.user);
            userRecord.verified = true;
            userRecord.email = verification.email;
            await this.updateUser(userRecord._id, userRecord);
            await this.redis.deleteKey(key);
            this.logger.info('User %o successfully verified with email %e', userRecord.username, verification.email);
            return true;
        }
        catch (e) {
            this.logger.error("There was an error verifying mail: %o", e);
            throw e;
        }
    }
};
UserService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('userModel')),
    __param(1, typedi_1.Inject('logger')),
    __param(2, eventDispatcher_1.EventDispatcher()),
    __metadata("design:paramtypes", [Object, Object, eventDispatcher_1.EventDispatcherInterface,
        redisService_1.default])
], UserService);
exports.default = UserService;
//# sourceMappingURL=userService.js.map