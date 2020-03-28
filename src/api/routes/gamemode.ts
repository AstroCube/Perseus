import { Router, Request, Response, NextFunction } from "express";
import { Container } from "typedi";
import GamemodeService from "../../services/gamemodeService";
import { IGamemode } from "../../interfaces/IGamemode";
const route = Router();

export default (app: Router) => {

  app.use('/gamemode', route);

  route.get(
    '/get/:id',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service: GamemodeService = Container.get(GamemodeService);
        const gamemode: IGamemode = await service.viewGamemode(req.params.id);
        return res.json(gamemode).status(200);
      } catch (e) {
        return next(e);
      }
    });

  route.get(
    '/list',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const service: GamemodeService = Container.get(GamemodeService);
        const gamemodes: IGamemode[] = await service.listGamemodes();
        return res.json(gamemodes).status(200);
      } catch (e) {
        return next(e);
      }
    });

};
