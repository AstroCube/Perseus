import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { celebrate, Joi } from "celebrate";
import middlewares from "../../middlewares";
import ForumCategoryService from "../../../services/forum/forumCategoryService";
import {IForumCategory} from "../../../interfaces/forum/IForumCategory";
import {IPaginateResult} from "mongoose";
import ForumService from "../../../services/forum/forumService";
import {IForum} from "../../../interfaces/forum/IForum";
import userOptional from "../../middlewares/userOptional";
const route = Router();

export default (app: Router) => {

    app.use('/forum/base', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                order: Joi.number().required(),
                description: Joi.string(),
                category: Joi.string().required(),
                parent: Joi.string(),
                guest: Joi.boolean()
            })
        }),
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions('forum.manage'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const forumService : ForumService = Container.get(ForumService);
                const category = await forumService.create(req.body as IForum);
                return res.json(category).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/:id',
        middlewares.optionalAuth,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const forumService: ForumService = Container.get(ForumService);
                const forum: IForum = await forumService.get(req.params.id, req.currentUser);
                return res.json(forum).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        middlewares.authentication,
        middlewares.userOptional,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page) : undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const forumService: ForumService = Container.get(ForumService);
                const forum: IPaginateResult<IForum> = await forumService.list(req.currentUser, req.body, {...req.query, page, perPage});
                return res.json(forum).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.put(
        '/',
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions('forum.manage'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const forumService: ForumService = Container.get(ForumService);
                const forum: IForumCategory = await forumService.update(req.body as IForum);
                return res.json(forum).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.delete(
        '/:id',
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions('forum.manage'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const forumService: ForumService = Container.get(ForumService);
                await forumService.delete(req.params.id);
                return res.json({deleted: true}).status(200);
            } catch (e) {
                return next(e);
            }
        });

};
