"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const argon2_1 = __importDefault(require("argon2"));
const geoIp = __importStar(require("geoip-lite"));
const events_1 = __importDefault(require("../subscribers/events"));
const eventDispatcher_1 = require("../decorators/eventDispatcher");
const crypto_1 = require("crypto");
const statsService_1 = __importDefault(require("./statsService"));
let AuthService = AuthService_1 = class AuthService {
    constructor(userModel, dispatcher, logger, stats) {
        this.userModel = userModel;
        this.dispatcher = dispatcher;
        this.logger = logger;
        this.stats = stats;
    }
    async signIn(email, password) {
        try {
            const userRecord = await this.userModel.findOne({ email });
            if (!userRecord) {
                throw new Error('User not registered');
            }
            const validPassword = await argon2_1.default.verify(userRecord.password, password);
            if (validPassword) {
                const token = AuthService_1.generateToken(userRecord._id);
                const user = userRecord.toObject();
                Reflect.deleteProperty(user, 'password');
                Reflect.deleteProperty(user, 'salt');
                return { user, token };
            }
            else {
                throw new Error('Invalid Password');
            }
        }
        catch (e) {
            this.logger.error('There was an error logging user to the website: %o', e);
            throw e;
        }
    }
    async serverLogin(login) {
        try {
            const userRecord = await this.userModel.findById(login.user);
            if (!userRecord)
                throw new Error('User not registered');
            const validPassword = await argon2_1.default.verify(userRecord.password, login.password);
            if (validPassword) {
                const address = {
                    number: login.address,
                    country: geoIp.lookup(login.address).country,
                    primary: false
                };
                this.dispatcher.dispatch(events_1.default.user.serverLogin, { user: userRecord, address });
                return true;
            }
            else {
                throw new Error('UnauthorizedError');
            }
        }
        catch (e) {
            this.logger.error('There was an error logging user to the server: %o', e);
            throw e;
        }
    }
    async serverRegister(register) {
        try {
            const salt = crypto_1.randomBytes(32);
            const hashedPassword = await argon2_1.default.hash(register.password, { salt });
            const registeredUser = await this.userModel.findByIdAndUpdate(register.user, {
                password: hashedPassword,
                salt: salt.toString(),
                $push: {
                    address: {
                        number: register.address,
                        country: geoIp.lookup(register.address).country,
                        primary: true
                    }
                }
            });
            await this.stats.createStatsDocument(registeredUser._id);
            Reflect.deleteProperty(registeredUser, 'password');
            Reflect.deleteProperty(registeredUser, 'salt');
            return registeredUser;
        }
        catch (e) {
            this.logger.error('There was an error registering user to the server: %o', e);
            throw e;
        }
    }
    static generateToken(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);
        return jsonwebtoken_1.default.sign({
            _id: user,
            exp: exp.getTime() / 1000
        }, config_1.default.jwtSecret);
    }
};
AuthService = AuthService_1 = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('userModel')),
    __param(1, eventDispatcher_1.EventDispatcher()),
    __param(2, typedi_1.Inject('logger')),
    __metadata("design:paramtypes", [Object, eventDispatcher_1.EventDispatcherInterface, Object, statsService_1.default])
], AuthService);
exports.default = AuthService;
//# sourceMappingURL=authService.js.map