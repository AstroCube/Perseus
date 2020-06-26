import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import middlewares from "../middlewares";
import { celebrate, Joi } from "celebrate";
import FriendService from "../../services/friendService";
import {IFriend} from "../../interfaces/IFriend";
const route = Router();

export default (app: Router) => {

  app.use('/friend', route);

  route.post(
    '/',
    celebrate({
      body: Joi.object({
        sender: Joi.string().required(),
        receiver: Joi.string().required(),
        issuer: Joi.string()
      })
    }),
    middlewares.cluster,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const friendService: FriendService = Container.get(FriendService);
        const friend: IFriend = await friendService.create(req.body as IFriend);
        return res.json(friend).status(200);
      } catch (e) {
        return next(e);
      }
    });

    route.get(
        '/:id',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const friendService: FriendService = Container.get(FriendService);
                const friend: IFriend = await friendService.get(req.params.id);
                return res.json(friend).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const friendService: FriendService = Container.get(FriendService);
                return res.json(await friendService.list(req.body, {...req.query, page, perPage})).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.delete(
        '/delete',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const friendService: FriendService = Container.get(FriendService);
                return res.json(await friendService.delete(req.body));
            } catch (e) {
                return next(e);
            }
        });

};
