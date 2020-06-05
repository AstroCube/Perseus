"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const typedi_1 = require("typedi");
const Mail = __importStar(require("nodemailer/lib/mailer"));
const config_1 = __importDefault(require("../config"));
let MailerService = class MailerService {
    constructor(mailClient, logger) {
        this.mailClient = mailClient;
        this.logger = logger;
    }
    async mailUpdate(update) {
        try {
            const date = new Date();
            let mail = fs.readFileSync(__dirname + "/templates/update.html", { encoding: 'utf-8' });
            mail = mail.replace("%%username%%", update.user.display);
            mail = mail.replace("%%code%%", update.code + "");
            mail = mail.replace("%%date%%", date.getFullYear() + "");
            let mailOptions = {
                from: config_1.default.emails.auth.user,
                to: update.update,
                subject: 'Actualización de correo',
                html: mail
            };
            return await this.mailClient.sendMail(mailOptions);
        }
        catch (e) {
            this.logger.error('There was an error sending update email: %o', e);
        }
    }
    async mailVerify(update) {
        try {
            const date = new Date();
            let mail = fs.readFileSync(__dirname + "/templates/verify.html", { encoding: 'utf-8' });
            mail = mail.replace("%%username%%", update.user.display);
            mail = mail.replace("%%skin%%", update.user.skin);
            mail = mail.replace("%%link%%", update.link);
            mail = mail.replace("%%date%%", date.getFullYear() + "");
            let mailOptions = {
                from: config_1.default.emails.auth.user,
                to: update.email,
                subject: 'Verifica tu correo electrónico',
                html: mail
            };
            return await this.mailClient.sendMail(mailOptions);
        }
        catch (e) {
            this.logger.error('There was an error sending verification email: %o', e);
        }
    }
};
MailerService = __decorate([
    typedi_1.Service(),
    __param(0, typedi_1.Inject('mailClient')),
    __param(1, typedi_1.Inject('logger')),
    __metadata("design:paramtypes", [Object, Object])
], MailerService);
exports.default = MailerService;
//# sourceMappingURL=mailerService.js.map