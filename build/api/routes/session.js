"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const celebrate_1 = require("celebrate");
const sessionService_1 = __importDefault(require("../../services/sessionService"));
const cluster_1 = __importDefault(require("../middlewares/cluster"));
const route = express_1.Router();
exports.default = (app) => {
    app.use('/session', route);
    route.post('/auth-session', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            username: celebrate_1.Joi.string().required(),
            address: celebrate_1.Joi.string().required()
        })
    }), cluster_1.default, async (req, res, next) => {
        try {
            const session = typedi_1.Container.get(sessionService_1.default);
            const authentication = await session.authenticateSessionCheck(req.body);
            return res.json(authentication).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/user-disconnect/:id', cluster_1.default, async (req, res, next) => {
        try {
            const session = typedi_1.Container.get(sessionService_1.default);
            await session.serverDisconnect(req.params.id);
            return res.json({ disconnected: true }).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/server-switch', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            user: celebrate_1.Joi.string().required(),
            server: [celebrate_1.Joi.string(), celebrate_1.Joi.allow(null)],
            lobby: [celebrate_1.Joi.string(), celebrate_1.Joi.allow(null)]
        })
    }), cluster_1.default, async (req, res, next) => {
        try {
            const session = typedi_1.Container.get(sessionService_1.default);
            await session.serverSwitch(req.body);
            return res.json(true).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
};
//# sourceMappingURL=session.js.map