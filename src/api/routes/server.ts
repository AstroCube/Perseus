import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { celebrate, Joi } from "celebrate";
import AuthService from "../../services/authService";
import { Logger } from "winston";
import ServerService from "../../services/serverService";
import { IServer, IServerAuthResponse } from "../../interfaces/IServer";
import serverAttachment from "../middlewares/serverAttachment";
import cluster from "../middlewares/cluster";
const route = Router();

export default (app: Router) => {

  app.use('/servers', route);

  route.post(
    '/connect',
    async (req: Request, res: Response, next: NextFunction) => {
      const logger : Logger = Container.get('logger');
      try {
        const service: ServerService = Container.get(ServerService);
        const server: IServerAuthResponse = await service.loadServer(req.body as IServer);
        return res.json(server).status(200);
      } catch (e) {
        logger.error( e );
        return next(e);
      }
    });

  route.get(
    '/get/:id',
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
    '/find',
    cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger : Logger = Container.get('logger');
      try {
        const service: ServerService = Container.get(ServerService);
        const server: IServer[] = await service.getServersByQuery(req.body);
        return res.json(server).status(200);
      } catch (e) {
        logger.error( e );
        return next(e);
      }
    });

  route.put(
    '/update/:id',
    cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger : Logger = Container.get('logger');
      try {
        const service: ServerService = Container.get(ServerService);
        const server: IServer = await service.updateServer(req.params.id, req.body);
        return res.json(server).status(200);
      } catch (e) {
        logger.error( e );
        return next(e);
      }
    });

  route.get(
    '/disconnect',
    cluster,
    serverAttachment,
    async (req: Request, res: Response, next: NextFunction) => {
      const logger : Logger = Container.get('logger');
      try {
        const service: ServerService = Container.get(ServerService);
        await service.disconnectServer(req.currentServer._id);
        return res.json({disconnected: true}).status(200);
      } catch (e) {
        logger.error( e );
        return next(e);
      }
    });

};
