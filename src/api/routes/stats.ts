import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import middlewares from "../middlewares";
import StatsService from "../../services/statsService";
import {IStats} from "../../interfaces/IStats";

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

    route.put(
        '',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const statsService: StatsService = Container.get(StatsService);
                const stats: IStats = await statsService.update(req.body as IStats);
                return res.json(stats).status(200);
            } catch (e) {
                return next(e);
            }
        });
};
