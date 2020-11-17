import { Router, Request, Response, NextFunction } from "express";
import {StorageService} from "../../services/storageService";
import {Container} from "typedi";
const route = Router();

export default (app: Router) => {

  app.use('/map', route);

  route.post(
    '/',
    /*
    celebrate({
      body: Joi.object({
        name: Joi.string().required(),
        file: Joi.string().required(),
        configuration: Joi.string().required(),
        image: Joi.string().required(),
        author: Joi.string().required(),
        version: Joi.string().required(),
        gamemode: Joi.string().required(),
        subGamemode: Joi.array().required(),
        description: Joi.string().required(),
        contributors: Joi.string()
      })
    }),
     */
    async (req: Request, res: Response, next: NextFunction) => {
      try {

        const storage: StorageService = Container.get(StorageService);
        await storage.writeFile(req.body.slime);
        return res.json({shittie: true}).status(200);
      } catch (e) {
        return next(e);
      }
    });

};
