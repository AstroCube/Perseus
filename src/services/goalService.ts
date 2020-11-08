import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {EventDispatcher, EventDispatcherInterface} from "../decorators/eventDispatcher";
import {IGoal} from "../interfaces/stats/IGoal";
import {ResponseError} from "../interfaces/error/ResponseError";

@Service()
export default class GoalService {

    constructor(
        @Inject('goalModel') private goalModel : Models.GoalModel,
        @Inject('logger') private logger : Logger,
        @EventDispatcher() private dispatcher : EventDispatcherInterface,
    ) {}

    public async createGoal(goal : IGoal) : Promise<IGoal> {
        try {
            const goalRecord = await this.goalModel.create(goal)
            if (!goalRecord) throw new ResponseError('There was an error creating the goal', 500);
            return goalRecord;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

   public async getGoal(id: string) : Promise<IGoal> {
       try {
           const goal: IGoal = await this.goalModel.findById(id);
           if (!goal) throw new ResponseError('The requested goal was not found', 404);
           return goal;
       } catch (e) {
           this.logger.error('There was an error obtaining a goal request: %o', e);
           throw e;
       }
   }

   public async getGoalsByQuery(query? : any) : Promise<IGoal[]> {
       try {
           if (!query) return await this.goalModel.find();
           return await this.goalModel.find(query);
       } catch (e) {
           this.logger.error(e);
           throw e;
       }
   }
}