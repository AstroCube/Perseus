import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import ChannelService from "../../../services/channel/channelService";
import {ChannelVisibility, IChannel} from "../../../interfaces/channel/IChannel";
import {celebrate, Joi} from "celebrate";
import middlewares from "../../middlewares";
const route = Router();

export default (app: Router) => {

  app.use('/channel', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                lifecycle: Joi.number(),
                confirmation: Joi.boolean(),
                visibility: Joi.string().valid(...Object.values(ChannelVisibility)),
                participants: Joi.array().items(Joi.string()),
                permissions: Joi.string()
            })
        }),
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: ChannelService = Container.get(ChannelService);
                const channel: IChannel = await service.create(req.body as IChannel);
                return res.json(channel).status(200);
            } catch (e) {
                return next(e);
            }
        });

  route.get(
      '/:id',
      middlewares.cluster,
      async (req: Request, res: Response, next: NextFunction) => {
          try {
              const service: ChannelService = Container.get(ChannelService);
              const channel: IChannel = await service.get(req.params.id);
              return res.json(channel).status(200);
          } catch (e) {
              return next(e);
          }
      });

    route.put(
        '/',
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                name: Joi.string(),
                lifecycle: Joi.number(),
                confirmation: Joi.boolean(),
                visibility: Joi.string().valid(...Object.values(ChannelVisibility)),
                participants: Joi.array().items(Joi.string()),
                permissions: Joi.string()
            })
        }),
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: ChannelService = Container.get(ChannelService);
                const channel: IChannel = await service.update(req.body as IChannel);
                return res.json(channel).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.delete(
        '/:id',
        middlewares.cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: ChannelService = Container.get(ChannelService);
                await service.delete(req.params.id);
                return res.json({deleted: true}).status(200);
            } catch (e) {
                return next(e);
            }
        });

};
