import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import {IAppeal} from "../../interfaces/IAppeal";
import AppealService from "../../services/appealService";
import { IPaginateResult } from "mongoose";
import middlewares from "../middlewares";
import {IAppealsPermissions} from "../../interfaces/permissions/IAppealsPermissions";
const route = Router();

export default (app: Router) => {

  app.use('/appeal', route);

  route.post(
    '/create',
      middlewares.authentication,
      middlewares.userAttachment,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
        const service: AppealService = Container.get(AppealService);
        const appeal: IAppeal = await service.createAppeal(req.body, req.currentUser);
        return res.json(appeal).status(200);
        } catch (e) {
            return next(e);
        }
    });

    route.get(
        '/get/:id',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: AppealService = Container.get(AppealService);
                const appeal: IAppeal = await service.getAppeal(req.params.id, req.currentUser);
                return res.json(appeal).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                let page: number = undefined; if (req.query.page && req.query.page !== '-1') page = parseInt(<string>req.query.page);
                let perPage: number = 10; if (req.query.perPage) perPage = parseInt(<string>req.query.perPage);

                const service: AppealService = Container.get(AppealService);
                const appeal: IPaginateResult<IAppeal> = await service.listAppeals(req.body, page, perPage, req.currentUser, req.query.own as unknown as boolean);
                return res.json(appeal).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.put(
        '/action/:id',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: AppealService = Container.get(AppealService);
                const appeal: IAppeal = await service.generateAction(req.params.id, req.body, req.currentUser);
                return res.json(appeal).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/permissions',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: AppealService = Container.get(AppealService);
                const appeal: IAppealsPermissions = await service.getAppealPermissions(req.currentUser);
                return res.json(appeal).status(200);
            } catch (e) {
                return next(e);
            }
        });
};
