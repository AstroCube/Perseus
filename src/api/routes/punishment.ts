import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import {IPunishment} from "../../interfaces/IPunishment";
import PunishmentService from "../../services/punishmentService";
import middlewares from "../middlewares";
import {IPaginateResult} from "mongoose";
const route = Router();

export default (app: Router) => {

  app.use('/punishment', route);

  route.post(
      '/create',
      middlewares.authentication,
      middlewares.userAttachment,
      async (req: Request, res: Response, next: NextFunction) => {
          try {
              const service: PunishmentService = Container.get(PunishmentService);
              req.body.issuer = req.currentUser;
              const punishment: IPunishment = await service.createPunishment(req.body);
              return res.json(punishment).status(200);
          } catch (e) {
              return next(e);
          }
      });

    route.post(
        '/create',
        middlewares.cluster,
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

  route.get(
    '/list',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
          const service: PunishmentService = Container.get(PunishmentService);
          const punishment: IPaginateResult<IPunishment> = await service.listPunishments(req.body, parseInt(<string>req.query.page), parseInt(<string>req.query.size));
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
