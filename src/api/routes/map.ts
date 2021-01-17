import { Router, Request, Response, NextFunction } from "express";
import {Container} from "typedi";
import * as stream from "stream";
import {celebrate, Joi} from "celebrate";
import MapService from "../../services/mapService";
import {IMap, IMapCreation} from "../../interfaces/IMap";
import PunishmentService from "../../services/punishmentService";
import {IPunishment} from "../../interfaces/IPunishment";
import middlewares from "../middlewares";
import {IPaginateResult} from "mongoose";
const route = Router();

export default (app: Router) => {

  app.use('/map', route);

  route.post(
    '/',
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        file: Joi.string().required(),
        configuration: Joi.string().required(),
        image: Joi.string().required(),
        author: Joi.string().required(),
        version: Joi.string().required(),
        gamemode: Joi.string().required(),
        subGamemode: Joi.array().required(),
        description: Joi.string().required(),
        contributors: Joi.array()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service: MapService = Container.get(MapService);
        return res.json(service.create(req.body as IMapCreation)).status(200);
      } catch (e) {
        return next(e);
      }
    });

    route.put(
        '/',
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                name: Joi.string().required(),
                author: Joi.string().required(),
                description: Joi.string().required(),
                contributors: Joi.string()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                return res.json(service.updateFile(req.body._id, req.body)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/update-version',
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                file: Joi.string().required(),
                configuration: Joi.string().required(),
                image: Joi.string().required(),
                version: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                return res.json(service.updateFile(req.body._id, req.body)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                return res.json(await service.get(req.params.id)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list-web',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const map: IPaginateResult<IMap> = await service.list(req.body, {...req.query, page, perPage});
                return res.json(map).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        middlewares.authentication,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const map: IPaginateResult<IMap> = await service.list(req.body, {...req.query, page, perPage});
                return res.json(map).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/files/image/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                const readStream = new stream.PassThrough();
                readStream.end(await service.getImage(req.params.id, req.query.version as any));
                res.set('Content-disposition', 'attachment; filename=' + req.params.id + ".jpg");
                res.set('Content-Type', 'text/plain');
                readStream.pipe(res);
                return res.status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/files/file/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                const readStream = new stream.PassThrough();
                readStream.end(await service.getFile(req.params.id, req.query.version as any));
                res.set('Content-disposition', 'attachment; filename=' + req.params.id + ".slime");
                res.set('Content-Type', 'text/plain');
                readStream.pipe(res);
                return res.status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/files/config/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                const readStream = new stream.PassThrough();
                readStream.end(await service.getConfiguration(req.params.id, req.query.version as any));
                res.set('Content-disposition', 'attachment; filename=' + req.params.id + ".json");
                res.set('Content-Type', 'text/plain');
                readStream.pipe(res);
                return res.status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.delete(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                return res.json(service.delete(req.params.id)).status(200);
            } catch (e) {
                return next(e);
            }
        }
    );

};
