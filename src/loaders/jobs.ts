import config from '../config';
import Agenda from 'agenda';
import UnregisteredClearSequenceJob from "../jobs/unregisteredSequence";
import UnregisterChannel from "../jobs/unregisterChannel";

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
        new UnregisterChannel().handler
    );

    agenda.every(config.server.ping + ' seconds', 'unregistered-clean');
    agenda.start();
};
