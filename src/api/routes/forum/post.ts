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
import PostService from "../../../services/forum/postService";
import {IPost} from "../../../interfaces/forum/IPost";
import userOptional from "../../middlewares/userOptional";
const route = Router();

export default (app: Router) => {

    app.use('/forum/post', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                content: Joi.string().required(),
                author: Joi.string().required(),
                quote: Joi.string(),
                topic: Joi.string().required()
            })
        }),
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const postService: PostService = Container.get(PostService);
                const post = await postService.create(req.body as IPost, req.currentUser);
                return res.json(post).status(200);
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
                const postService: PostService = Container.get(PostService);
                const post: IPost = await postService.get(req.params.id, req.currentUser);
                return res.json(post).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/like-status/:id',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const postService: PostService = Container.get(PostService);
                const post: IPost = await postService.likeStatus(req.params.id, req.currentUser);
                return res.json(post).status(200);
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
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const postService: PostService = Container.get(PostService);
                const post: IPaginateResult<IPost> = await postService.list(req.body, {...req.query, page, perPage}, req.currentUser);
                return res.json(post).status(200);
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
                const postService: PostService = Container.get(PostService);
                const post: IPost = await postService.update(req.body as IPost, req.currentUser);
                return res.json(post).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.delete(
        '/:id',
        middlewares.authentication,
        middlewares.userOptional,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const postService: PostService = Container.get(PostService);
                await postService.delete(req.params.id);
                return res.json({deleted: true}).status(200);
            } catch (e) {
                return next(e);
            }
        });

};
