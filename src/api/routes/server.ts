import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import {Logger} from "winston";
import ServerService from "../../services/serverService";
import {IServer} from "../../interfaces/IServer";
import serverAttachment from "../middlewares/serverAttachment";
import cluster from "../middlewares/cluster";
import {celebrate, Joi} from "celebrate";
import {IPaginateResult} from "mongoose";

const route = Router();

export default (app: Router) => {

  app.use('/server', route);

    route.get(
        '/view/me',
        cluster,
        serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            return res.status(200).send(req.currentServer);
        });

  route.post(
    '/',
      celebrate({
          body: Joi.object({
              slug: Joi.string().required(),
              type: Joi.string().required(),
              gameMode: Joi.string(),
              subGameMode: Joi.string(),
              maxRunning: Joi.number(),
              maxTotal: Joi.number(),
              sandbox: Joi.boolean().required(),
              cluster: Joi.string().required()
          })
      }),
    async (req: Request, res: Response, next: NextFunction) => {
      const logger : Logger = Container.get('logger');
      try {
        const service: ServerService = Container.get(ServerService);
        const token: string = await service.loadServer(req.body as IServer);
        return res.json(token).status(200);
      } catch (e) {
        logger.error( e );
        return next(e);
      }
    });

  route.get(
    '/:id',
    cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger : Logger = Container.get('logger');
      try {
        const service: ServerService = Container.get(ServerService);
        const server: IServer = await service.getServer(req.params.id);
        return res.json(server).status(200);
      } catch (e) {
        logger.error( e );
        return next(e);
      }
    });

  route.post(
    '/list',
    cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger : Logger = Container.get('logger');
      try {
        const service: ServerService = Container.get(ServerService);
        const server: IPaginateResult<IServer> = await service.getServersByQuery(req.body, req.query);
        return res.json(server).status(200);
      } catch (e) {
        logger.error( e );
        return next(e);
      }
    });

  route.put(
    '/:id',
    cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger : Logger = Container.get('logger');
      try {
        const service: ServerService = Container.get(ServerService);
        const server: IServer = await service.updateServer(req.params.id, req.body);
        return res.json(server).status(200);
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    });

  route.delete(
    '/',
    cluster,
    serverAttachment,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger : Logger = Container.get('logger');
      try {
        const service: ServerService = Container.get(ServerService);
        await service.disconnectServer(req.currentServer._id);
        return res.json(true).status(200);
      } catch (e) {
        logger.error(e);
        return next(e);
      }
    });

};
