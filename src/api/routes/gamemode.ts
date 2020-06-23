import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import GamemodeService from "../../services/gamemodeService";
import { IGamemode } from "../../interfaces/IGamemode";
import {IPaginateResult} from "mongoose";
const route = Router();

export default (app: Router) => {

  app.use('/gamemode', route);

  route.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service: GamemodeService = Container.get(GamemodeService);
        const gamemode: IGamemode = await service.viewGamemode(req.params.id);
        return res.json(gamemode).status(200);
      } catch (e) {
        return next(e);
      }
    });

  route.post(
    '/list',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const page: number = req.query.page && req.query.page !== '-1' ? parseInt(<string>req.query.page) : undefined;
        const perPage: number = req.query.perPage ? parseInt(<string>req.query.perPage) : 10;
        const service: GamemodeService = Container.get(GamemodeService);
        const gamemodes: IPaginateResult<IGamemode> = await service.listGamemodes(req.body, {...req.query, page, perPage});
        return res.json(gamemodes).status(200);
      } catch (e) {
        return next(e);
      }
    });

};
