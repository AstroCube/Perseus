"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const typedi_1 = require("typedi");
const gamemodeService_1 = __importDefault(require("../../services/gamemodeService"));
const route = express_1.Router();
exports.default = (app) => {
    app.use('/gamemode', route);
    route.get('/get/:id', async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(gamemodeService_1.default);
            const gamemode = await service.viewGamemode(req.params.id);
            return res.json(gamemode).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
    route.get('/list', async (req, res, next) => {
        try {
            const service = typedi_1.Container.get(gamemodeService_1.default);
            const gamemodes = await service.listGamemodes();
            return res.json(gamemodes).status(200);
        }
        catch (e) {
            return next(e);
        }
    });
};
//# sourceMappingURL=gamemode.js.map