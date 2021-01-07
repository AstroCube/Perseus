import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import {celebrate, Joi} from "celebrate";
import middlewares from "../../middlewares";
import {IChannelMessage, MessageOrigin} from "../../../interfaces/channel/IChannelMessage";
import ChannelMessageService from "../../../services/channel/channelMessageService";

const route = Router();

export default (app: Router) => {

  app.use('/channel-message', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                sender: Joi.string().required(),
                channel: Joi.string().required(),
                message: Joi.string().required(),
                origin: Joi.string().valid(...Object.values(MessageOrigin)),
                viewed: Joi.array().items(Joi.string()),
                meta: Joi.object()
            })
        }),
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: ChannelMessageService = Container.get(ChannelMessageService);
                const message: IChannelMessage = await service.create(req.body as IChannelMessage);
                return res.json(message).status(200);
            } catch (e) {
                return next(e);
            }
        });

  route.get(
      '/:id',
      middlewares.cluster,
      async (req: Request, res: Response, next: NextFunction) => {
          try {
              const service: ChannelMessageService = Container.get(ChannelMessageService);
              const message: IChannelMessage = await service.get(req.params.id);
              return res.json(message).status(200);
          } catch (e) {
              return next(e);
          }
      });

    route.put(
        '/',
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                name: Joi.string().required(),
                channel: Joi.string().required(),
                origin: Joi.string().valid(...Object.values(MessageOrigin)),
                viewed: Joi.array().items(Joi.string()),
                meta: Joi.object()
            })
        }),
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: ChannelMessageService = Container.get(ChannelMessageService);
                const message: IChannelMessage = await service.update(req.body as IChannelMessage);
                return res.json(message).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.delete(
        '/:id',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: ChannelMessageService = Container.get(ChannelMessageService);
                await service.delete(req.params.id);
                return res.json({deleted: true}).status(200);
            } catch (e) {
                return next(e);
            }
        });

};
