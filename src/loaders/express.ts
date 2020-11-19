import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import routes from '../api';
import config from '../config';
import {ResponseError} from "../interfaces/error/ResponseError";

export default ({ app }: { app: express.Application }) => {

    app.get('/status', (req, res) => {
        res.status(200).end();
    });
    app.head('/status', (req, res) => {
        res.status(200).end();
    });

    app.enable('trust proxy');
    app.use(cors());
    app.use(require('method-override')());
    app.use(bodyParser.json({limit: '100mb'}));
    app.use(config.api.prefix, routes());
    app.use((req, res, next) => {
        next(new ResponseError('Route not found', 404));
    });

    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json(err.message);
    });

};
