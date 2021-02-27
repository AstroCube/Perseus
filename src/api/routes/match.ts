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
                const match: IMatch = await matchService.update(req.body as IMatch);
                return res.json(match).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/cleanup',
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                await matchService.cleanupUnassigned(req.currentServer);
                return res.json({updated: true}).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/spectator',
        celebrate({
            body: Joi.object({
                user: Joi.string().required(),
                match: Joi.string().required(),
                join: Joi.boolean().required()
            })
        }),
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                return res.json(await matchService.assignSpectator(req.body.user, req.body.match, req.body.join)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/teams',
        celebrate({
            body: Joi.object({
                teams: Joi.array().required(),
                match: Joi.string().required()
            })
        }),
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                return res.json(await matchService.assignMatchTeams(req.body.teams, req.body.match)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/pending',
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                return res.json(await matchService.assignPending(req.body.pending, req.body.match)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/unassign-pending',
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                return res.json(await matchService.unAssignPending(req.body.user, req.body.match)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/validate-winners/:id',
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                return res.json(await matchService.validateWinners(req.params.id, req.body)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/privatize',
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                return res.json(await matchService.privatize(req.body.requester, req.body.id)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/disqualify',
        celebrate({
            body: Joi.object({
                user: Joi.string().required(),
                match: Joi.string().required()
            })
        }),
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const matchService: MatchService = Container.get(MatchService);
                return res.json(await matchService.disqualify(req.body.user, req.body.match)).status(200);
            } catch (e) {
                return next(e);
            }
        });


};
