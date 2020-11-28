import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import middlewares from "../middlewares";
import {celebrate, Joi} from "celebrate";
import {IPaginateResult} from "mongoose";
import MatchService from "../../services/matchService";
import {IMatch} from "../../interfaces/IMatch";

const route = Router();

export default (app: Router) => {

  app.use('/match', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                map: Joi.string().optional().allow(''),
                gamemode: Joi.string().required(),
                subGamemode: Joi.string().required()
            })
        }),
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                const match: IMatch = await matchService.createMatch(req.body as IMatch, req.currentServer);
                return res.json(match).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/:id',
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
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const matchService: MatchService = Container.get(MatchService);
                const match: IPaginateResult<IMatch> = await matchService.list(req.body, {...req.query, page, perPage});
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
                console.log(req.body);
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
