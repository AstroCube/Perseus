import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import GroupService from "../../services/groupService";
import {IGroup, IPermissions, IStaffGroup} from "../../interfaces/IGroup";
import middlewares from "../middlewares";
import {celebrate, Joi} from "celebrate";
import {IPaginateResult} from "mongoose";

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
        '/actionable/manifest',
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
        '/actionable/staff',
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
        '/actionable/add-user',
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
                const groupService: GroupService = Container.get(GroupService);
                await groupService.addUser(req.body.user, req.body.group, req.body.comment);
                return res.json(true).status(200);
            } catch (e) {
                return next(e);
            }
        });

    route.post(
        '/actionable/remove-user',
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
                const groupService: GroupService = Container.get(GroupService);
                await groupService.removeUser(req.body.user, req.body.group);
                return res.json(true).status(200);
            } catch (e) {
                return next(e);
            }
        });

};
