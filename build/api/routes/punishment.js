"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const punishmentService_1 = __importDefault(require("../../services/punishmentService"));
const middlewares_1 = __importDefault(require("../middlewares"));
const route = express_1.Router();
exports.default = (app) => {
    app.use('/punishment', route);
    route.post('/create', middlewares_1.default.authentication, middlewares_1.default.userAttachment, async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(punishmentService_1.default);
            req.body.issuer = req.currentUser;
            const punishment = await service.createPunishment(req.body);
            return res.json(punishment).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/create', middlewares_1.default.cluster, async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(punishmentService_1.default);
            const punishment = await service.createPunishment(req.body);
            return res.json(punishment).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/get/:id', async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(punishmentService_1.default);
            const punishment = await service.getPunishment(req.params.id);
            return res.json(punishment).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/list', async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(punishmentService_1.default);
            const punishment = await service.listPunishments(req.body, req.query.page, req.query.size);
            return res.json(punishment).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/get-last', async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(punishmentService_1.default);
            const punishment = await service.getLastPunishment(req.body);
            return res.json(punishment).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.put('/update', async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(punishmentService_1.default);
            const punishment = await service.updatePunishment(req.body);
            return res.json(punishment).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
};
//# sourceMappingURL=punishment.js.map