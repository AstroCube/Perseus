"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const groupService_1 = __importDefault(require("../../services/groupService"));
const middlewares_1 = __importDefault(require("../middlewares"));
const celebrate_1 = require("celebrate");
const route = express_1.Router();
exports.default = (app) => {
    app.use('/group', route);
    route.post('/create', middlewares_1.default.authentication, middlewares_1.default.userAttachment, middlewares_1.default.permissions("group.create"), async (req, res, next) => {
        try {
            const groupService = typedi_1.Container.get(groupService_1.default);
            const group = await groupService.createGroup(req.body, req.currentUser);
            return res.json(group).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/view/:id', middlewares_1.default.authentication, middlewares_1.default.userAttachment, middlewares_1.default.permissions("group.read"), async (req, res, next) => {
        try {
            const groupService = typedi_1.Container.get(groupService_1.default);
            const group = await groupService.viewGroup(req.params.id);
            return res.json(group).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/manifest', middlewares_1.default.authentication, middlewares_1.default.userAttachment, async (req, res, next) => {
        try {
            const groupService = typedi_1.Container.get(groupService_1.default);
            const permissions = await groupService.permissionsManifest(req.currentUser);
            return res.json(permissions).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/list/:page?', middlewares_1.default.authentication, middlewares_1.default.userAttachment, middlewares_1.default.permissions("group.read"), async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(groupService_1.default);
            let pages = 1;
            if (req.params.page)
                pages = +req.params.page;
            const group = await service.listGroup(pages);
            return res.status(200).json(group);
        }
        catch (e) {
            next(e);
        }
    });
    route.put('/update/:id', middlewares_1.default.authentication, middlewares_1.default.userAttachment, middlewares_1.default.permissions("group.update"), async (req, res, next) => {
        try {
            const groupService = typedi_1.Container.get(groupService_1.default);
            const group = await groupService.updateGroup(req.params.id, req.body);
            return res.json(group).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/add-user', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            user: celebrate_1.Joi.string().required(),
            group: celebrate_1.Joi.string().required()
        })
    }), middlewares_1.default.authentication, middlewares_1.default.userAttachment, middlewares_1.default.permissions("group.assign"), async (req, res, next) => {
        try {
            const groupService = typedi_1.Container.get(groupService_1.default);
            const user = await groupService.addUser(req.body.user, req.body.group);
            return res.json(user).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.post('/remove-user', celebrate_1.celebrate({
        body: celebrate_1.Joi.object({
            user: celebrate_1.Joi.string().required(),
            group: celebrate_1.Joi.string().required()
        })
    }), middlewares_1.default.authentication, middlewares_1.default.userAttachment, middlewares_1.default.permissions("group.assign"), async (req, res, next) => {
        try {
            const groupService = typedi_1.Container.get(groupService_1.default);
            const user = await groupService.removeUser(req.body.user, req.body.group);
            return res.json(user).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
};
//# sourceMappingURL=group.js.map