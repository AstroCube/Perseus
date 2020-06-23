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
import StatsService from "../../services/statsService";
import statsService from "../../services/statsService";
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
