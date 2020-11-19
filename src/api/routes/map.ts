import { Router, Request, Response, NextFunction } from "express";
import {StorageService} from "../../services/storageService";
import {Container} from "typedi";
import * as stream from "stream";
import {celebrate, Joi} from "celebrate";
import MapService from "../../services/mapService";
import {IMap, IMapCreation} from "../../interfaces/IMap";
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
        contributors: Joi.string()
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

    route.get(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: MapService = Container.get(MapService);
                return res.json(service.get(req.params.id)).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/image/:id',
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
        '/file/:id',
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
        '/config/:id',
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

};
