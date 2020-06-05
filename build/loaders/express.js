"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const api_1 = __importDefault(require("../api"));
const config_1 = __importDefault(require("../config"));
exports.default = ({ app }) => {
    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });
    app.enable('trust proxy');
    app.use(cors_1.default());
    app.use(require('method-override')());
    app.use(body_parser_1.default.json());
    app.use(config_1.default.api.prefix, api_1.default());
    app.use((req, res, next) => {
        const err = new Error('Not Found');
        err['status'] = 404;
        next(err);
    });
    app.use((err, req, res, next) => {
        if (err.message.toString() === 'UnauthorizedError' || err.name === 'UnauthorizedError') {
            return res
                .status(403)
                .send({ message: err.message })
                .end();
        }
        else if (err.message.toString() === 'NotFound' || err.name === 'NotFound') {
            return res
                .status(404)
                .send({ message: err.message })
                .end();
        }
        else if (err.message.toString() === 'BadRequestError' || err.name === 'BadRequestError') {
            res
                .status(400)
                .send({ message: err.message })
                .end();
        }
        return next(err);
    });
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({
            errors: {
                message: err.message,
            },
        });
    });
};
//# sourceMappingURL=express.js.map