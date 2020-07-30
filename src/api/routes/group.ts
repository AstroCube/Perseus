import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import GroupService from "../../services/groupService";
import {IGroup, IPermissions, IStaffGroup} from "../../interfaces/IGroup";
import middlewares from "../middlewares";
import { celebrate, Joi } from "celebrate";
import { IPaginateResult } from "mongoose";
import { IUser } from "../../interfaces/IUser";
const route = Router();

export default (app: Router) => {

    app.use('/group', route);

    route.post(
        '/',
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions("group.manage"),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const groupService: GroupService = Container.get(GroupService);
                const group: IGroup = await groupService.createGroup(req.body as IGroup, req.currentUser);
                return res.json(group).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/:id',
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions("group.manage"),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const groupService: GroupService = Container.get(GroupService);
                const group: IGroup = await groupService.viewGroup(req.params.id);
                return res.json(group).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/manifest',
        middlewares.authentication,
        middlewares.userAttachment,
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const groupService: GroupService = Container.get(GroupService);
                const permissions: IPermissions = await groupService.permissionsManifest(req.currentUser);
                return res.json(permissions).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.get(
        '/staff',
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const groupService: GroupService = Container.get(GroupService);
                const group: IStaffGroup[] = await groupService.getStaffBoard();
                return res.json(group).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/list',
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions("group.manage"),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const service: GroupService = Container.get(GroupService);
                const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page)  :  undefined;
                const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
                const group: IPaginateResult<IGroup> = await service.listGroup(req.body, {...req.query, page, perPage});
                return res.status(200).json(group);
            } catch (e) {
                next(e);
            }
        });

    route.put(
        '/',
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions("group.manage"),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const groupService : GroupService = Container.get(GroupService);
                const group : IGroup = await groupService.updateGroup(req.body as IGroup);
                return res.json(group).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/add-user',
        celebrate({
            body: Joi.object({
                user: Joi.string().required(),
                group: Joi.string().required(),
                comment: Joi.string()
            })
        }),
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions("group.manage"),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const groupService : GroupService = Container.get(GroupService);
                const user : IUser = await groupService.addUser(req.body.user, req.body.group, req.body.comment);
                return res.json(user).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/remove-user',
        celebrate({
            body: Joi.object({
                user: Joi.string().required(),
                group: Joi.string().required()
            })
        }),
        middlewares.authentication,
        middlewares.userAttachment,
        middlewares.permissions("group.manage"),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const groupService : GroupService = Container.get(GroupService);
                const user : IUser = await groupService.removeUser(req.body.user, req.body.group);
                return res.json(user).status(200);
            } catch (e) {
                return next(e);
            }
        });

};
