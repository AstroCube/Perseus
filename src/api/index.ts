import { Router } from 'express';
import user from "./routes/user";
import auth from "./routes/auth";
import group from "./routes/group";
import gamemode from "./routes/gamemode";
import server from "./routes/server";

export default () => {
    const app = Router();

    auth(app);
    group(app);
    gamemode(app);
    server(app);
    user(app);

    return app
}
