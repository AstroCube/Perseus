import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import GroupService from "../../services/groupService";
import {IGroup, IPermissions} from "../../interfaces/IGroup";
import middlewares from "../middlewares";
import { celebrate, Joi } from "celebrate";
import { IPaginateResult } from "mongoose";
import { IUser } from "../../interfaces/IUser";
import MapService from "../../services/mapService";
import {IMap} from "../../interfaces/IMap";
import MatchService from "../../services/matchService";
import {IMatch} from "../../interfaces/IMatch";
const route = Router();

export default (app: Router) => {

  app.use('/match', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                map: Joi.string().required(),
                teams: Joi.array().required(),
                status: Joi.string().required(),
                gamemode: Joi.string().required(),
                subGamemode: Joi.string().required()
            })
        }),
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                const match: IMatch = await matchService.createMatch(req.body as IMatch);
                return res.json(match).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/:id',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                const match: IMatch = await matchService.get(req.params.id);
                return res.json(match).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const matchService: MatchService = Container.get(MatchService);
                const match: IPaginateResult<IMatch> = await matchService.list(req.body, page, perPage);
                return res.json(match).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.put(
        '/',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                const match: IMatch = await matchService.update(req.body as IMatch);
                return res.json(match).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/cleanup',
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                await matchService.cleanupUnassigned(req.currentServer);
                return res.json({}).status(200);
            } catch (e) {
                return next(e);
            }
        });
};
