"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const serverService_1 = __importDefault(require("../../services/serverService"));
const serverAttachment_1 = __importDefault(require("../middlewares/serverAttachment"));
const cluster_1 = __importDefault(require("../middlewares/cluster"));
const route = express_1.Router();
exports.default = (app) => {
    app.use('/servers', route);
    route.post('/connect', async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        try {
            const service = typedi_1.Container.get(serverService_1.default);
            const server = await service.loadServer(req.body);
            return res.json(server).status(200);
        }
        catch (e) {
            logger.error(e);
            return next(e);
        }
    });
    route.get('/get/:id', cluster_1.default, async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        try {
            const service = typedi_1.Container.get(serverService_1.default);
            const server = await service.getServer(req.params.id);
            return res.json(server).status(200);
        }
        catch (e) {
            logger.error(e);
            return next(e);
        }
    });
    route.post('/find', cluster_1.default, async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        try {
            const service = typedi_1.Container.get(serverService_1.default);
            const server = await service.getServersByQuery(req.body);
            return res.json(server).status(200);
        }
        catch (e) {
            logger.error(e);
            return next(e);
        }
    });
    route.put('/update/:id', cluster_1.default, async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        try {
            const service = typedi_1.Container.get(serverService_1.default);
            const server = await service.updateServer(req.params.id, req.body);
            return res.json(server).status(200);
        }
        catch (e) {
            logger.error(e);
            return next(e);
        }
    });
    route.get('/disconnect', cluster_1.default, serverAttachment_1.default, async (req, res, next) => {
        const logger = typedi_1.Container.get('logger');
        try {
            const service = typedi_1.Container.get(serverService_1.default);
            await service.disconnectServer(req.currentServer._id);
            return res.json(true).status(200);
        }
        catch (e) {
            logger.error(e);
            return next(e);
        }
    });
};
//# sourceMappingURL=server.js.map