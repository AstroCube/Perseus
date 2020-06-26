import { Router } from 'express';
import appeal from "./routes/appeal";
import punishment from "./routes/punishment";
import user from "./routes/user";
import auth from "./routes/auth";
import group from "./routes/group";
import gamemode from "./routes/gamemode";
import server from "./routes/server";
import session from "./routes/session";
import report from "./routes/report";
import match from "./routes/match";
import map from "./routes/map";
import stats from "./routes/stats";
import friend from "./routes/friend";
import forumCategory from "./routes/forum/forumCategory";

export default () => {
    const app = Router();

    appeal(app);
    auth(app);
    forumCategory(app);
    friend(app);
    group(app);
    map(app);
    match(app);
    gamemode(app);
    punishment(app);
    report(app);
    server(app);
    session(app);
    stats(app);
    user(app);

    return app
}
