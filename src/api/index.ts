import { Router } from 'express';
import user from "./routes/user";
import auth from "./routes/auth";
import group from "./routes/group";
import gamemode from "./routes/gamemode";

export default () => {
    const app = Router();

    auth(app);
    group(app);
    gamemode(app);
    user(app);

    return app
}
