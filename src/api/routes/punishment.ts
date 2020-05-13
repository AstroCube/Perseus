import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import {IPunishment} from "../../interfaces/IPunishment";
import GamemodeService from "../../services/gamemodeService";
import { IGamemode } from "../../interfaces/IGamemode";
import PunishmentService from "../../services/punishmentService";
const route = Router();

export default (app: Router) => {

  app.use('/punishment', route);

  route.post(
      '/create',
      async (req: Request, res: Response, next: NextFunction) => {
          try {
              const service: PunishmentService = Container.get(PunishmentService);
              const punishment: IPunishment = await service.createPunishment(req.body);
              return res.json(punishment).status(200);
          } catch (e) {
              return next(e);
          }
      });

  route.get(
    '/get/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
          const service: PunishmentService = Container.get(PunishmentService);
          const punishment: IPunishment = await service.getPunishment(req.params.id);
          return res.json(punishment).status(200);
      } catch (e) {
        return next(e);
      }
    });

  route.post(
    '/list',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
          const service: PunishmentService = Container.get(PunishmentService);
          const punishment: IPunishment[] = await service.listPunishments(req.body);
          return res.json(punishment).status(200);
      } catch (e) {
        return next(e);
      }
    });

    route.post(
        '/get-last',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: PunishmentService = Container.get(PunishmentService);
                const punishment: IPunishment = await service.getLastPunishment(req.body);
                return res.json(punishment).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.put(
        '/update',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: PunishmentService = Container.get(PunishmentService);
                const punishment: IPunishment = await service.updatePunishment(req.body as IPunishment);
                return res.json(punishment).status(200);
            } catch (e) {
                return next(e);
            }
        });

};
