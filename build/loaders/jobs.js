"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const unregisteredSequence_1 = __importDefault(require("../jobs/unregisteredSequence"));
exports.default = ({ agenda }) => {
    agenda.define('unregistered-clean', { priority: 'high', concurrency: config_1.default.agenda.concurrency }, new unregisteredSequence_1.default().handler);
    agenda.every('60 minutes', 'unregistered-clean');
    agenda.start();
};
//# sourceMappingURL=jobs.js.map