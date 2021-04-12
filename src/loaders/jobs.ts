import config from '../config';
import Agenda from 'agenda';
import UnregisteredClearSequenceJob from "../jobs/unregisteredSequence";
import UnregisterChannel from "../jobs/unregisterChannel";
import ServerPing from "../jobs/serverPing";

export default ({ agenda }: { agenda: Agenda }) => {
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

    agenda.every('30 minutes', 'unregistered-clean');
    agenda.every(config.server.ping + ' seconds', 'unregistered-clean');
    agenda.start();
};
