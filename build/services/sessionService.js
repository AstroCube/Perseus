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
const config_1 = __importDefault(require("../config"));
let SessionService = class SessionService {
    constructor(userModel, logger) {
        this.userModel = userModel;
        this.logger = logger;
    }
    async authenticateSessionCheck(session) {
        try {
            let registered = await this.userModel.findOne({ username: session.username });
            if (registered) {
                registered.session.online = true;
                let final = await registered.save();
                return {
                    user: final,
                    registered: final.password !== undefined,
                    multiAccount: false
                };
            }
            const multi = await this.userModel.findOne({ address: { number: session.address, primary: true } });
            if (multi)
                return {
                    user: multi,
                    registered: true,
                    multiAccount: true
                };
            const userGroups = [];
            userGroups.push({
                group: config_1.default.defaultGroup,
                joined: new Date(),
                comment: null
            });
            const created = await this.userModel.create({
                username: session.username,
                display: session.username,
                skin: session.username,
                session: {
                    lastSeen: new Date(),
                    online: true
                },
                groups: userGroups
            });
            if (!created)
                throw Error('The user was not created successfully');
            return {
                user: created,
                registered: false,
                multiAccount: false
            };
        }
        catch (e) {
            this.logger.error('There was an error parsing user auth session %o', e);
        }
    }
    async serverDisconnect(user) {
        try {
            let userRecord = await this.userModel.findById(user);
            userRecord.session.lastSeen = new Date();
            userRecord.session.online = false;
            await userRecord.save();
        }
        catch (e) {
            this.logger.error('There was an error logging out an user: %o', e);
            throw e;
        }
    }
    async serverSwitch(switching) {
        try {
            if (!switching.server && !switching.lobby)
                return;
            let userRecord = await this.userModel.findById(switching.user);
            if (switching.server)
                userRecord.session.lastGame = switching.server;
            if (switching.lobby)
                userRecord.session.lastLobby = switching.lobby;
            await userRecord.save();
        }
        catch (e) {
            this.logger.error('There was an error switching servers with user: %o', e);
            throw e;
        }
    }
};
SessionService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('userModel')),
    __param(1, typedi_1.Inject('logger')),
    __metadata("design:paramtypes", [Object, Object])
], SessionService);
exports.default = SessionService;
//# sourceMappingURL=sessionService.js.map