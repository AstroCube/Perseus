import { Container } from 'typedi';
import LoggerInstance from './logger';
import agendaFactory from './agenda';
import { RedisClient } from "redis";
import * as Mail from "nodemailer/lib/mailer";

export default (
  {mailer, redisClient, mongoConnection, models}:
    {mailer: Mail, redisClient: RedisClient; mongoConnection; models: { name: string; model: any }[] }
    ) => {
    try {
        models.forEach(m => {
            Container.set(m.name, m.model);
            LoggerInstance.info(m.name + ' injected correctly');
        });

        const agendaInstance = agendaFactory({ mongoConnection });

        Container.set('redis', redisClient);
        Container.set('agendaInstance', agendaInstance);
        Container.set('mailClient', mailer);
        Container.set('logger', LoggerInstance);

        LoggerInstance.info('Agenda injected into container');

        return { agenda: agendaInstance };
    } catch (e) {
        LoggerInstance.error('Error on dependency injector loader: %o', e);
        throw e;
    }
};
