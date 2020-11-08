import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import {IPunishment} from "../../interfaces/IPunishment";
import PunishmentService from "../../services/punishmentService";
import middlewares from "../middlewares";
import {IPaginateResult} from "mongoose";

const route = Router();

export default (app: Router) => {

  app.use('/punishment', route);

  route.post(
      '/create-website',
      middlewares.authentication,
      middlewares.userAttachment,
      async (req: Request, res: Response, next: NextFunction) => {
          try {
              const service: PunishmentService = Container.get(PunishmentService);
              req.body.issuer = req.currentUser;
              const punishment: IPunishment = await service.createPunishment(req.body, req.currentUser, req.query.report as string);
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

  route.post(
    '/list',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
          let page: number = undefined; if (req.query.page  && req.query.page !== '-1') page = parseInt(<string>req.query.page);
          let perPage: number = 10; if (req.query.perPage) perPage = parseInt(<string>req.query.perPage);

          const service: PunishmentService = Container.get(PunishmentService);
          const punishment: IPaginateResult<IPunishment> = await service.listPunishments(req.body, page, perPage);
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
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions("punishments.manage"),
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
