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
import {ITopic} from "../../../interfaces/forum/ITopic";
const route = Router();

export default (app: Router) => {

    app.use('/forum/topic', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                subject: Joi.string().required(),
                author: Joi.string().required(),
                forum: Joi.string().required()
            })
        }),
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const topicService: TopicService = Container.get(TopicService);
                const topic = await topicService.create(req.body as ITopic);
                return res.json(topic).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const topicService: TopicService = Container.get(TopicService);
                const topic: ITopic = await topicService.get(req.params.id);
                return res.json(topic).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const topicService: TopicService = Container.get(TopicService);
                const topic: IPaginateResult<ITopic> = await topicService.list(req.body, {...req.query, page, perPage});
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
                const topic: ITopic = await topicService.update(req.body as ITopic);
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
