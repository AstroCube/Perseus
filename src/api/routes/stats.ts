import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import middlewares from "../middlewares";
import StatsService from "../../services/statsService";
import {IStats} from "../../interfaces/IStats";
import {IPaginateResult} from "mongoose";

const route = Router();

export default (app: Router) => {

  app.use('/stats', route);

  route.get(
      ':id',
      middlewares.cluster,
      async (req: Request, res: Response, next: NextFunction) => {
          try {
              const statsService: StatsService = Container.get(StatsService);
              const stats: IStats = await statsService.get(req.params.id);
              return res.json(stats).status(200);
          } catch (e) {
              return next(e);
          }
      });

    route.post(
        '',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const statsService: StatsService = Container.get(StatsService);
                const stats: IStats = await statsService.create(req.body as IStats);
                return res.json(stats).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        'actions/invalidate/:id',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const statsService: StatsService = Container.get(StatsService);
                await statsService.invalidate(req.params.id);
                return res.json({updated: true}).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: StatsService = Container.get(StatsService);
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const stats: IPaginateResult<IStats> = await service.list(req.body, {...req.query, page, perPage});
                return res.status(200).json(stats);
            } catch (e) {
                next(e);
            }
        });

};
