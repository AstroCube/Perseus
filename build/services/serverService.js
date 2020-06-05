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
var ServerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const clusterService_1 = __importDefault(require("./clusterService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
let ServerService = ServerService_1 = class ServerService {
    constructor(serverModel, logger, clusterService) {
        this.serverModel = serverModel;
        this.logger = logger;
        this.clusterService = clusterService;
    }
    async loadServer(authorization) {
        try {
            Reflect.deleteProperty(authorization, '_id');
            const cluster = await this.clusterService.viewCluster(authorization.cluster);
            const serverRecord = await this.serverModel.create(Object.assign(Object.assign({}, authorization), { cluster: cluster._id, players: [], matches: [] }));
            this.logger.info("Successfully loaded server %o to the database with name " + serverRecord.slug, serverRecord._id);
            if (!serverRecord)
                throw new Error("Server could not be created");
            return { server: serverRecord, token: ServerService_1.generateToken(serverRecord._id) };
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async getServer(id) {
        try {
            const server = await this.serverModel.findById(id);
            if (!server)
                throw new Error("NotFound");
            return server;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async getServersByQuery(query) {
        try {
            if (!query)
                return await this.serverModel.find();
            return await this.serverModel.find(query);
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async updateServer(id, updatable) {
        try {
            Reflect.deleteProperty(updatable, 'cluster');
            Reflect.deleteProperty(updatable, 'slug');
            Reflect.deleteProperty(updatable, 'type');
            const serverRecord = await this.serverModel.findByIdAndUpdate(id, updatable, { new: true });
            if (!serverRecord)
                throw new Error("Server was not updated correctly.");
            return serverRecord;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async disconnectServer(id) {
        try {
            await this.serverModel.findByIdAndDelete(id);
            this.logger.info("Successfully disconnected server %o", id);
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    static generateToken(server) {
        return jsonwebtoken_1.default.sign({
            _id: server
        }, config_1.default.jwtSecret);
    }
};
ServerService = ServerService_1 = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('serverModel')),
    __param(1, typedi_1.Inject('logger')),
    __metadata("design:paramtypes", [Object, Object, clusterService_1.default])
], ServerService);
exports.default = ServerService;
//# sourceMappingURL=serverService.js.map