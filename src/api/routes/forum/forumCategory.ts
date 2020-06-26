import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import { celebrate, Joi } from "celebrate";
import middlewares from "../../middlewares";
import ForumCategoryService from "../../../services/forum/forumCategoryService";
import {IForumCategory} from "../../../interfaces/forum/IForumCategory";
import {IPaginateResult} from "mongoose";
const route = Router();

export default (app: Router) => {

    app.use('/forum/category', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                name: Joi.string().required(),
                order: Joi.number().required()
            })
        }),
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions('category'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const categoryService : ForumCategoryService = Container.get(ForumCategoryService);
                const category = await categoryService.create(req.body as IForumCategory);
                return res.json(category).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/:id',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const categoryService: ForumCategoryService = Container.get(ForumCategoryService);
                const category: IForumCategory = await categoryService.get(req.params.id);
                return res.json(category).status(200);
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
                const categoryService: ForumCategoryService = Container.get(ForumCategoryService);
                const category: IPaginateResult<IForumCategory> = await categoryService.list(req.body, {...req.query, page, perPage});
                return res.json(category).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.put(
        '/',
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions('category'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const categoryService: ForumCategoryService = Container.get(ForumCategoryService);
                const category: IForumCategory = await categoryService.update(req.body as IForumCategory);
                return res.json(category).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.delete(
        '/:id',
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions('category'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const categoryService: ForumCategoryService = Container.get(ForumCategoryService);
                await categoryService.delete(req.params.id);
                return res.json({deleted: true}).status(200);
            } catch (e) {
                return next(e);
            }
        });

};
