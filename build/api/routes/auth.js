"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const celebrate_1 = require("celebrate");
const authService_1 = __importDefault(require("../../services/authService"));
const route = express_1.Router();
exports.default = (app) => {
    app.use('/authentication', route);
    route.post('/login', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            email: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required()
        })
    }), async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const authServiceInstance = typedi_1.Container.get(authService_1.default);
            const { user, token } = await authServiceInstance.signIn(email, password);
            return res.json({ user, token }).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/login-server', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            user: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
            address: celebrate_1.Joi.string().required()
        })
    }), async (req, res, next) => {
        try {
            const authServiceInstance = typedi_1.Container.get(authService_1.default);
            const logged = await authServiceInstance.serverLogin(req.body);
            return res.json(logged).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/register-server', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            user: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required(),
            address: celebrate_1.Joi.string().required()
        })
    }), async (req, res, next) => {
        try {
            const authServiceInstance = typedi_1.Container.get(authService_1.default);
            const registered = await authServiceInstance.serverRegister(req.body);
            return res.json(registered).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
};
//# sourceMappingURL=auth.js.map