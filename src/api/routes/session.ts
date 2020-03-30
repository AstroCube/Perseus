import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { celebrate, Joi } from "celebrate";
import SessionService from "../../services/sessionService";
import { IAuthenticationResponse } from "../../interfaces/ISession";
import cluster from "../middlewares/cluster";
const route = Router();

export default (app: Router) => {

  app.use('/session', route);

  route.post(
    '/auth-session',
    celebrate({
      body: Joi.object({
        username: Joi.string().required(),
        address: Joi.string().required()
      })
    }),
    cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const session: SessionService = Container.get(SessionService);
        const authentication: IAuthenticationResponse = await session.authenticateSessionCheck(req.body);
        return res.json(authentication).status(200);
      } catch (e) {
        return next(e);
      }
    });

  route.get(
    '/user-disconnect/:id',
    cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const session: SessionService = Container.get(SessionService);
        await session.serverDisconnect(req.params.id);
        return res.json({disconnected: true}).status(200);
      } catch (e) {
        return next(e);
      }
    });

  route.post(
    '/server-switch',
    celebrate({
      body: Joi.object({
        user: Joi.string().required(),
        server: [Joi.string(), Joi.allow(null)],
        lobby: [Joi.string(), Joi.allow(null)]
      })
    }),
    cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const session: SessionService = Container.get(SessionService);
        await session.serverSwitch(req.body);
        return res.json(true).status(200);
      } catch (e) {
        return next(e);
      }
    });

};
