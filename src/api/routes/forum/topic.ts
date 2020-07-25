import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { celebrate, Joi } from "celebrate";
import middlewares from "../../middlewares";
import ForumCategoryService from "../../../services/forum/forumCategoryService";
import {IForumCategory} from "../../../interfaces/forum/IForumCategory";
import {IPaginateResult} from "mongoose";
import ForumService from "../../../services/forum/forumService";
import {IForum} from "../../../interfaces/forum/IForum";
import TopicService from "../../../services/forum/topicService";
import {ITopic, ITopicUpdate, ITopicView} from "../../../interfaces/forum/ITopic";
import userOptional from "../../middlewares/userOptional";
import ForumViewService from "../../../services/forum/forumViewService";
const route = Router();

export default (app: Router) => {

    app.use('/forum/topic', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                subject: Joi.string().required(),
                author: Joi.string().required(),
                forum: Joi.string().required(),
                pinned: Joi.string(),
                official: Joi.string(),
                locked: Joi.string()
            })
        }),
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const topicService: TopicService = Container.get(TopicService);
                const topic = await topicService.create(req.body as ITopic, req.currentUser);
                return res.json(topic).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/:id',
        middlewares.authentication,
        middlewares.userOptional,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const topicService: TopicService = Container.get(TopicService);
                const topic: ITopic = await topicService.get(req.params.id, req.currentUser);
                return res.json(topic).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/interact/:id',
        middlewares.authentication,
        middlewares.userOptional,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const forumViewService: ForumViewService = Container.get(ForumViewService);
                return res.json(
                    await forumViewService.topicInteractView(req.params.id, req.currentUser, req.query.quote as string)
                ).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/view/:id',
        middlewares.authentication,
        middlewares.userOptional,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const topicService: ForumViewService = Container.get(ForumViewService);
                const topic: ITopicView = await topicService.topicViewData(
                    req.params.id,
                    req.query.page as any,
                    req.query.perPage as any,
                    req.currentUser
                );
                return res.json(topic).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.put(
        '/',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const topicService: TopicService = Container.get(TopicService);
                const topic: ITopic = await topicService.update(req.body as ITopicUpdate, req.currentUser);
                return res.json(topic).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/subscription',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const topicService: TopicService = Container.get(TopicService);
                const topic: ITopic = await topicService.subscriptionStatus(req.params.id, req.currentUser);
                return res.json(topic).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.delete(
        '/:id',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const topicService: TopicService = Container.get(TopicService);
                await topicService.delete(req.params.id);
                return res.json({deleted: true}).status(200);
            } catch (e) {
                return next(e);
            }
        });

};
