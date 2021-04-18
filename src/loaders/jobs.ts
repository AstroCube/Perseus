import config from '../config';
import Agenda from 'agenda';
import UnregisteredClearSequenceJob from "../jobs/unregisteredSequence";
import UnregisterChannel from "../jobs/unregisterChannel";
import ServerPing from "../jobs/serverPing";
import UserPing from "../jobs/userPing";

export default async ({ agenda }: { agenda: Agenda }) => {
    agenda.define(
        'unregistered-clean',
        { priority: 'high', concurrency: config.agenda.concurrency },
        new UnregisteredClearSequenceJob().handler,
    );

    agenda.define(
        'unregister-channel',
        { priority: 'high', concurrency: config.agenda.concurrency },
        new UnregisterChannel().handler
    );

    agenda.define(
        'server-ping',
        { priority: 'high', concurrency: config.agenda.concurrency },
        new ServerPing().handler
    );

    agenda.define(
        'session-ping',
        { priority: 'high', concurrency: config.agenda.concurrency },
        new UserPing().handler
    );

    await agenda.every('30 minutes', 'unregistered-clean');
    await agenda.every(config.server.ping + ' seconds', 'server-ping');
    await agenda.every(config.session.ping + ' seconds', 'session-ping');
    await agenda.start();
};
