import { Router, Request, Response, NextFunction } from "express";
import {StorageService} from "../../services/storageService";
import {Container} from "typedi";
import * as stream from "stream";
import {celebrate, Joi} from "celebrate";
import MapService from "../../services/mapService";
import {IMap} from "../../interfaces/IMap";
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
        return res.json(service.create(req.body as IMap)).status(200);
      } catch (e) {
        return next(e);
      }
    });

    route.get(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const storage: StorageService = Container.get(StorageService);
                const readStream = new stream.PassThrough();
                readStream.end(await storage.readFile(req.params.id));
                res.set('Content-disposition', 'attachment; filename=' + "demo.slime");
                res.set('Content-Type', 'text/plain');
                readStream.pipe(res);
                return res.status(200);
            } catch (e) {
                return next(e);
            }
        });

};
