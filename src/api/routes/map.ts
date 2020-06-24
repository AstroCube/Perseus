import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import GroupService from "../../services/groupService";
import {IGroup, IPermissions} from "../../interfaces/IGroup";
import middlewares from "../middlewares";
import { celebrate, Joi } from "celebrate";
import { IPaginateResult } from "mongoose";
import { IUser } from "../../interfaces/IUser";
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
        const map: IMap = await mapService.loadMap(req.body);
        return res.json(map).status(200);
      } catch (e) {
        return next(e);
      }
    });

    route.get(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const mapService: MapService = Container.get(MapService);
                const populate = Boolean(req.query.populate) || false;
                const map: IMap = await mapService.getMap(req.params.id, populate);
                return res.json(map).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const mapService: MapService = Container.get(MapService);
                return res.json(await mapService.listMaps(req.body, {...req.query, page, perPage})).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/get-file',
        celebrate({
            body: Joi.object({
                id: Joi.string().required(),
                type: Joi.string().required(),
                extension: Joi.string().required()
            })
        }),
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const mapService: MapService = Container.get(MapService);
                return res.sendFile(await mapService.getMapFile(req.body.id, req.body.type, req.body.extension, req.currentUser));
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/get-image/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const mapService: MapService = Container.get(MapService);
                return res.sendFile(await mapService.getMapFile(req.params.id, 'images', 'png', req.currentUser));
            } catch (e) {
                return next(e);
            }
        });


};
