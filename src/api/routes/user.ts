import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import UserService from "../../services/userService";
import middlewares from '../middlewares';
import config from '../../config';
import {IMailRegister, IPasswordUpdate, IUser} from "../../interfaces/IUser";
import { IPaginateResult, Types } from "mongoose";
import { celebrate, Joi } from "celebrate";
import {ResponseError} from "../../interfaces/error/ResponseError";
const route = Router();

export default (app: Router) => {

  app.use('/user', route);

  route.get(
    '/:id',
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

  route.post(
    '/list',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service : UserService = Container.get(UserService);
          const page: number = req.query.page && req.query.page !== '-1' ? parseInt(req.query.page as string)  :  undefined;
          const perPage: number = req.query.perPage ? parseInt(req.query.perPage as string) : 10;
        const user : IPaginateResult<IUser> = await service.listUsers(req.body, {...req.query, page, perPage});
        return res.status(200).json(user);
      } catch (e) {
        next(e);
      }
    });

    route.put(
        '/',
        middlewares.cluster,
        middlewares.serverAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service : UserService = Container.get(UserService);
                const user: IUser = await service.updateUser(req.body);
                return res.status(200).json(user);
            } catch (e) {
                next(e);
            }
        });

    route.put(
        '/website',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service : UserService = Container.get(UserService);
                // TODO: Do complete logic at service
                if (req.body._id.toString() !== req.currentUser._id.toString()) throw new ResponseError('Not authorized to update other users', 403);
                const user: IUser = await service.updateUser(req.body);
                return res.status(200).json(user);
            } catch (e) {
                next(e);
            }
        });

    route.get(
        '/list-all/:own?',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service : UserService = Container.get(UserService);
                const users: IUser[] = await service.listFullUsers(req.params.own, req.currentUser._id, req.query.search as string);
                return res.status(200).json(users);
            } catch (e) {
                next(e);
            }
        });

  route.get(
    '/profile/me',
    middlewares.authentication,
    middlewares.userAttachment,
    async (req: Request, res: Response) => {
      return res.status(200).json(req.currentUser);
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

    route.post(
        '/verify-mail',
        middlewares.cluster,
        celebrate({
            body: Joi.object({
                user: Joi.string().required(),
                email: Joi.string().required()
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: UserService = Container.get(UserService);
                const updated = await service.verifyUser(req.body as IMailRegister, req.get("host"));
                return res.status(200).json(updated);
            } catch (e) {
                next(e);
            }
        });

    route.get(
        '/verify-code',
        async (req: Request, res: Response) => {
            try {
                const service: UserService = Container.get(UserService);
                await service.verifyCode({
                    email: new Buffer(req.query.mail as string, 'base64').toString('ascii'),
                    user: new Buffer(req.query.user as string, 'base64').toString('ascii'),
                    code: req.query.id as string
                });
                return res.redirect(config.api.frontend + '/login?verified=true');
            } catch (e) {
                return res.redirect(config.api.frontend + '/login?verified=false');
            }
        });
};
