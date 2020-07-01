import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { IPaginateResult } from "mongoose";
import middlewares from "../middlewares";
import ReportService from "../../services/reportService";
import {IReport} from "../../interfaces/IReport";
import {IReportsPermissions} from "../../interfaces/permissions/IReportsPermissions";
const route = Router();

export default (app: Router) => {

  app.use('/report', route);

  route.post(
    '/create',
      middlewares.authentication,
      middlewares.userAttachment,
      async (req: Request, res: Response, next: NextFunction) => {
        try {
        const service: ReportService = Container.get(ReportService);
        const report: IReport = await service.createReport(req.body, req.currentUser);
        return res.json(report).status(200);
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
                const service: ReportService = Container.get(ReportService);
                const report: IReport = await service.getReport(req.params.id, req.currentUser);
                return res.json(report).status(200);
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

                const service: ReportService = Container.get(ReportService);
                const report: IPaginateResult<IReport> = await service.listReports(req.body, page, perPage, req.currentUser);
                return res.json(report).status(200);
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
                const service: ReportService = Container.get(ReportService);
                const report: IReport = await service.generateAction(req.params.id, req.body, req.currentUser);
                return res.json(report).status(200);
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
                const service: ReportService = Container.get(ReportService);
                const report: IReportsPermissions = await service.getReportPermissions(req.currentUser);
                return res.json(report).status(200);
            } catch (e) {
                return next(e);
            }
        });
};
