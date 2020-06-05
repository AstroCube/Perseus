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
let PunishmentService = class PunishmentService {
    constructor(punishmentModel, logger) {
        this.punishmentModel = punishmentModel;
        this.logger = logger;
    }
    async createPunishment(punishment) {
        try {
            let match = undefined;
            if (punishment.match)
                match = punishment.match._id;
            let model = await this.punishmentModel.create(Object.assign(Object.assign({}, punishment), { issuer: punishment.issuer._id, punished: punishment.punished._id, match: match }));
            if (!model)
                throw new Error("There was an error creating a punishments.");
            return model;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async getPunishment(id) {
        try {
            const punishment = await this.punishmentModel.findById(id)
                .populate('issuer punished match')
                .select("-punished.password -punished.salt -issuer.password -issuer.salt");
            if (!punishment)
                throw new Error("Queried punishment does not exist.");
            return punishment;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async listPunishments(query, page, size) {
        try {
            let finalPage = 1;
            if (page)
                finalPage = page;
            let perPage = -1;
            if (size)
                perPage = size;
            return await this.punishmentModel.paginate(query, {
                sort: { createdAt: 1 },
                page: finalPage, perPage: parseInt(String(perPage)),
                populate: [
                    'issuer',
                    'punished',
                    'match'
                ],
                select: "-punished.password -punished.salt -issuer.password -issuer.salt"
            });
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async getLastPunishment(query) {
        try {
            return await this.punishmentModel.findOne(query).sort("createdAt");
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
    async updatePunishment(punishment) {
        try {
            const updatedPunishment = await this.punishmentModel.findByIdAndUpdate(punishment._id, punishment);
            if (!updatedPunishment)
                throw new Error("Queried punishment does not exist");
            return punishment;
        }
        catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
};
PunishmentService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('punishmentModel')),
    __param(1, typedi_1.Inject('logger')),
    __metadata("design:paramtypes", [Object, Object])
], PunishmentService);
exports.default = PunishmentService;
//# sourceMappingURL=punishmentService.js.map