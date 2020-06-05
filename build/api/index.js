"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const punishment_1 = __importDefault(require("./routes/punishment"));
const user_1 = __importDefault(require("./routes/user"));
const auth_1 = __importDefault(require("./routes/auth"));
const group_1 = __importDefault(require("./routes/group"));
const gamemode_1 = __importDefault(require("./routes/gamemode"));
const server_1 = __importDefault(require("./routes/server"));
const session_1 = __importDefault(require("./routes/session"));
exports.default = () => {
    const app = express_1.Router();
    auth_1.default(app);
    group_1.default(app);
    gamemode_1.default(app);
    punishment_1.default(app);
    server_1.default(app);
    session_1.default(app);
    user_1.default(app);
    return app;
};
//# sourceMappingURL=index.js.map