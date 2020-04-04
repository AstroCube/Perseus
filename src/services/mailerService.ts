import * as fs from "fs";
import {Inject, Service} from "typedi";
import {Logger} from "winston";
import {IMailUpdateVerification, IMailVerifyRequest} from "../interfaces/IUser";
import * as Mail from "nodemailer/lib/mailer";
import config from "../config";

@Service()
export default class MailerService {

  constructor(
    @Inject('mailClient') private mailClient : Mail,
    @Inject('logger') private logger: Logger
  ) {}

  public async mailUpdate(update: IMailUpdateVerification) {
    try {
      const date: Date = new Date();
      let mail = fs.readFileSync(__dirname + "/templates/update.html", {encoding: 'utf-8'});
      mail = mail.replace("%%username%%", update.user.display);
      mail = mail.replace("%%code%%", update.code + "");
      mail = mail.replace("%%date%%", date.getFullYear() + "");

      let mailOptions = {
        from: config.emails.auth.user,
        to: update.update,
        subject: 'Actualización de correo',
        html: mail
      };

      return await this.mailClient.sendMail(mailOptions);
    } catch (e) {
      this.logger.error('There was an error sending update email: %o', e);
    }
  }

  public async mailVerify(update: IMailVerifyRequest) {
    try {
      const date: Date = new Date();
      let mail: string = fs.readFileSync(__dirname + "/templates/verify.html", {encoding: 'utf-8'});
      mail = mail.replace("%%display%%", update.user.display);
      mail = mail.replace("%%skin%%", update.user.skin);
      mail = mail.replace("%%link%%", update.link);
      mail = mail.replace("%%date%%", date.getFullYear() + "");

      let mailOptions = {
        from: config.emails.auth.user,
        to: update.email,
        subject: 'Verifica tu correo electrónico',
        html: mail
      };

      return await this.mailClient.sendMail(mailOptions);
    } catch (e) {
      this.logger.error('There was an error sending verification email: %o', e);
    }
  }

}
