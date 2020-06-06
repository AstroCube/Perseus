import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import {IAppeal} from "../../interfaces/IAppeal";
import AppealService from "../../services/appealService";
import { IPaginateResult } from "mongoose";
import middlewares from "../middlewares";
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
                const appeal: IAppeal = await service.getAppeal(req.params.id);
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
                let page: number = 1; if (req.query.page) page = req.query.page;
                let perPage: number = 10; if (req.query.perPage) perPage = req.query.perPage;

                const service: AppealService = Container.get(AppealService);
                const appeal: IPaginateResult<IAppeal> = await service.listAppeals(req.body, page, perPage, req.currentUser);
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
                const appeal: IAppeal = await service.generateAction(req.params.id, req.body);
                return res.json(appeal).status(200);
            } catch (e) {
                return next(e);
            }
        });
};
