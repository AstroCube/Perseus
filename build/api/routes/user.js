"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const userService_1 = __importDefault(require("../../services/userService"));
const middlewares_1 = __importDefault(require("../middlewares"));
const config_1 = __importDefault(require("../../config"));
const mongoose_1 = require("mongoose");
const celebrate_1 = require("celebrate");
const route = express_1.Router();
exports.default = (app) => {
    app.use('/users', route);
    route.get('/view/:id', middlewares_1.default.authentication, middlewares_1.default.userAttachment, async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const request = req.params.id;
            if (mongoose_1.Types.ObjectId.isValid(request)) {
                const user = await service.viewUser(req.params.id);
                return res.status(200).json(user);
            }
            else {
                const user = await service.getUserByName(req.params.id);
                return res.status(200).json(user);
            }
        }
        catch (e) {
            next(e);
        }
    });
    route.get('/view-game/:id', middlewares_1.default.cluster, async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const user = await service.viewUser(req.params.id);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    });
    route.get('/find-game/:username', middlewares_1.default.cluster, async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const user = await service.getUserByName(req.params.username);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    });
    route.get('/list/:page?', middlewares_1.default.authentication, middlewares_1.default.userAttachment, middlewares_1.default.permissions("user.read"), async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            let pages = 1;
            if (req.params.page)
                pages = +req.params.page;
            const user = await service.listUsers(pages);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    });
    route.get('/list-all/:own?', middlewares_1.default.authentication, middlewares_1.default.userAttachment, middlewares_1.default.permissions("user.read"), async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const users = await service.listFullUsers(req.params.own, req.currentUser._id);
            return res.status(200).json(users);
        }
        catch (e) {
            next(e);
        }
    });
    route.get('/me', middlewares_1.default.authentication, middlewares_1.default.userAttachment, async (req, res) => {
        return res.status(200).json(req.currentUser);
    });
    route.put('/update/:id', middlewares_1.default.authentication, middlewares_1.default.userAttachment, middlewares_1.default.permissions("user.update"), async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const user = await service.updateUser(req.params.id, req.body);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    });
    route.put('/update-game/:id', middlewares_1.default.cluster, async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const user = await service.updateUser(req.params.id, req.body);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    });
    route.put('/update-profile', middlewares_1.default.authentication, middlewares_1.default.userAttachment, async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const user = await service.updateUser(req.currentUser._id, req.body);
            return res.status(200).json(user);
        }
        catch (e) {
            next(e);
        }
    });
    route.put('/update-password', middlewares_1.default.authentication, middlewares_1.default.userAttachment, celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            actual: celebrate_1.Joi.string().required(),
            password: celebrate_1.Joi.string().required()
        })
    }), async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const updated = await service.updatePassword(req.currentUser, req.body);
            return res.status(200).json(updated);
        }
        catch (e) {
            next(e);
        }
    });
    route.get('/update-mail-verification', middlewares_1.default.authentication, middlewares_1.default.userAttachment, celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            email: celebrate_1.Joi.string().required()
        })
    }), async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const updated = await service.mailUpdateValidation(req.currentUser);
            return res.status(200).json(updated);
        }
        catch (e) {
            next(e);
        }
    });
    route.post('/update-mail', middlewares_1.default.authentication, middlewares_1.default.userAttachment, celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            update: celebrate_1.Joi.string().required(),
            code: celebrate_1.Joi.number().required()
        })
    }), async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const updated = await service.mailUpdate({ user: req.currentUser, update: req.body.update, code: req.body.code });
            return res.status(200).json(updated);
        }
        catch (e) {
            next(e);
        }
    });
    route.post('/verify-mail', middlewares_1.default.cluster, celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            user: celebrate_1.Joi.string().required(),
            email: celebrate_1.Joi.string().required()
        })
    }), async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            const updated = await service.verifyUser(req.body, req.get("host"));
            return res.status(200).json(updated);
        }
        catch (e) {
            next(e);
        }
    });
    route.get('/verify-code', async (req, res) => {
        try {
            const service = typedi_1.Container.get(userService_1.default);
            await service.verifyCode({
                email: new Buffer(req.query.mail, 'base64').toString('ascii'),
                user: new Buffer(req.query.user, 'base64').toString('ascii'),
                code: req.query.id
            });
            return res.redirect(config_1.default.api.frontend + '/login?verified=true');
        }
        catch (e) {
            return res.redirect(config_1.default.api.frontend + '/login?verified=false');
        }
    });
};
//# sourceMappingURL=user.js.map