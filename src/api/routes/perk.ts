import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import middlewares from "../middlewares";
import {IPaginateResult} from "mongoose";
import PerkService from "../../services/perkService";
import {IPerk} from "../../interfaces/IPerk";

const route = Router();

export default (app: Router) => {

  app.use('/perk', route);

  route.get(
      ':id',
      middlewares.cluster,
      async (req: Request, res: Response, next: NextFunction) => {
          try {
              const perkService: PerkService = Container.get(PerkService);
              const stats: IPerk = await perkService.get(req.params.id);
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
                const perkService: PerkService = Container.get(PerkService);
                const stats: IPerk = await perkService.create(req.body as IPerk);
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
                const perkService: PerkService = Container.get(PerkService);
                return res.json( await perkService.update(req.body._id, req.body.stored)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: PerkService = Container.get(PerkService);
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page) : undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const stats: IPaginateResult<IPerk> = await service.list(req.body, {...req.query, page, perPage});
                return res.status(200).json(stats);
            } catch (e) {
                next(e);
            }
        });

};
