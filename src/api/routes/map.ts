import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import middlewares from "../middlewares";
import { celebrate, Joi } from "celebrate";
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
    middlewares.cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const mapService: MapService = Container.get(MapService);
        const map: IMap = await mapService.create(req.body);
        return res.json(map).status(200);
      } catch (e) {
        return next(e);
      }
    });

};
