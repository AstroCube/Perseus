import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import UserService from "../../services/userService";
import middlewares from '../middlewares';
import { IPasswordUpdate, IUser } from "../../interfaces/IUser";
import { IPaginateResult, Types } from "mongoose";
import { celebrate, Joi } from "celebrate";
const route = Router();

export default (app: Router) => {

  app.use('/users', route);

  route.get(
    '/view/:id',
    middlewares.authentication,
    middlewares.userAttachment,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service : UserService = Container.get(UserService);
        const request: string = req.params.id;
        if (Types.ObjectId.isValid(request)) {
          const user: IUser = await service.viewUser(req.params.id);
          return res.status(200).json(user);
        } else {
          const user: IUser = await service.getUserByName(req.params.id);
          return res.status(200).json(user);
        }
      } catch (e) {
        next(e);
      }
    });

  route.get(
    '/view-game/:id',
    middlewares.cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service : UserService = Container.get(UserService);
        const user: IUser = await service.viewUser(req.params.id);
        console.log(user);
        return res.status(200).json(user);
      } catch (e) {
        next(e);
      }
    });

  route.get(
    '/find-game/:username',
    middlewares.cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service : UserService = Container.get(UserService);
        const user: IUser = await service.getUserByName(req.params.username);
        return res.status(200).json(user);
      } catch (e) {
        next(e);
      }
    });

  route.get(
    '/list/:page?',
    middlewares.authentication,
    middlewares.userAttachment,
    middlewares.permissions("user.read"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service : UserService = Container.get(UserService);
        let pages: number = 1;
        if (req.params.page) pages = + req.params.page;
        const user : IPaginateResult<IUser> = await service.listUsers(pages);
        return res.status(200).json(user);
      } catch (e) {
        next(e);
      }
    });

  route.get(
    '/me',
    middlewares.authentication,
    middlewares.userAttachment,
    async (req: Request, res: Response) => {
      return res.status(200).json(req.currentUser);
    });

  route.put(
    '/update/:id',
    middlewares.authentication,
    middlewares.userAttachment,
    middlewares.permissions("user.update"),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service : UserService = Container.get(UserService);
        const user : IUser = await service.updateUser(req.params.id, req.body as IUser);
        return res.status(200).json(user);
      } catch (e) {
        next(e);
      }
    });

  route.put(
    '/update-game/:id',
    middlewares.cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service : UserService = Container.get(UserService);
        const user : IUser = await service.updateUser(req.params.id, req.body as IUser);
        return res.status(200).json(user);
      } catch (e) {
        next(e);
      }
    });

  route.put(
    '/update-profile',
    middlewares.authentication,
    middlewares.userAttachment,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service : UserService = Container.get(UserService);
        const user : IUser = await service.updateUser(req.currentUser._id, req.body as IUser);
        return res.status(200).json(user);
      } catch (e) {
        next(e);
      }
    });

  route.put(
    '/update-password',
    middlewares.authentication,
    middlewares.userAttachment,
    celebrate({
      body: Joi.object({
        actual: Joi.string().required(),
        password: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service: UserService = Container.get(UserService);
        const updated = await service.updatePassword(req.currentUser, req.body as IPasswordUpdate);
        return res.status(200).json(updated);
      } catch (e) {
        next(e);
      }
    });

  route.get(
    '/update-mail-verification',
    middlewares.authentication,
    middlewares.userAttachment,
    celebrate({
      body: Joi.object({
        email: Joi.string().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service: UserService = Container.get(UserService);
        const updated = await service.mailUpdateValidation(req.currentUser);
        return res.status(200).json(updated);
      } catch (e) {
        next(e);
      }
    });

  route.post(
    '/update-mail',
    middlewares.authentication,
    middlewares.userAttachment,
    celebrate({
      body: Joi.object({
        update: Joi.string().required(),
        code: Joi.number().required()
      })
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service: UserService = Container.get(UserService);
        const updated = await service.mailUpdate({user: req.currentUser, update: req.body.update, code: req.body.code});
        return res.status(200).json(updated);
      } catch (e) {
        next(e);
      }
    });

};
