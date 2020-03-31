import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { celebrate, Joi } from "celebrate";
import AuthService from "../../services/authService";
import { IUser } from "../../interfaces/IUser";
const route = Router();

export default (app: Router) => {

  app.use('/authentication', route);

  route.post(
    '/login',
    celebrate({
      body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, password } = req.body;
        const authServiceInstance : AuthService = Container.get(AuthService);
        const { user, token } = await authServiceInstance.signIn(email, password);
        return res.json({ user, token }).status(200);
      } catch (e) {
        return next(e);
      }
    });

  route.post(
    '/login-server',
    celebrate({
      body: Joi.object({
        user: Joi.string().required(),
        password: Joi.string().required(),
        address: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance : AuthService = Container.get(AuthService);
        const logged = await authServiceInstance.serverLogin(req.body);
        return res.json(logged).status(200);
      } catch (e) {
        return next(e);
      }
    });

  route.post(
    '/register-server',
    celebrate({
      body: Joi.object({
        user: Joi.string().required(),
        password: Joi.string().required(),
        address: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const authServiceInstance : AuthService = Container.get(AuthService);
        const registered: IUser = await authServiceInstance.serverRegister(req.body);
        return res.json(registered).status(200);
      } catch (e) {
        return next(e);
      }
    });

};
