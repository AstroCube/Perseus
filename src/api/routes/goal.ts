import {NextFunction, Request, Response, Router} from "express";
import {Container} from "typedi";
import {celebrate, Joi} from "celebrate";
import cluster from "../middlewares/cluster";
import {Logger} from "winston";
import GoalService from "../../services/goalService";
import {IGoal} from "../../interfaces/stats/IGoal";

const route = Router();

export default (app: Router) => {

    app.use('/goal', route);

    route.post(
        '/',
        celebrate({
            body: Joi.object({
                user: Joi.string().required(),
                match: Joi.string().required(),
                gamemode: Joi.string().required(),
                subGamemode: Joi.string().required(),
                objective: Joi.string().required(),
                meta: Joi.object(),
            })
        }),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger : Logger = Container.get('logger');
            try {
                const service: GoalService = Container.get(GoalService);
                const goal: IGoal = await service.createGoal(req.body as IGoal);
                return res.json(goal).status(200);
            } catch (e) {
                logger.error( e );
                return next(e);
            }
        }
    );

    route.get(
        '/:id',
        cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            const logger : Logger = Container.get('logger');
            try {
                const service: GoalService = Container.get(GoalService);
                const goal: IGoal = await service.getGoal(req.params.id);
                return res.json(goal).status(200);
            } catch (e) {
                logger.error( e );
                return next(e);
            }
        }
    );

    route.post(
        '/list',
        cluster,
        async (req: Request, res: Response, next: NextFunction) => {
            const logger : Logger = Container.get('logger');
            try {
                const service: GoalService = Container.get(GoalService);
                const goals: IGoal[] = await service.getGoalsByQuery(req.body);
                return res.json(goals).status(200);
            } catch (e) {
                logger.error( e );
                return next(e);
            }
        }
    );
}