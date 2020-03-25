import { Inject, Service } from "typedi";
import { IMailUpdateVerification, IUser } from "../interfaces/IUser";
import * as fs from "fs";
import * as Mail from "nodemailer/lib/mailer";
import config from "../config";

@Service()
export default class MailerService {

  constructor(
    @Inject('mailClient') private mailClient : Mail
  ) {}

  public async mailUpdate(update: IMailUpdateVerification) {

    const date: Date = new Date();
    let mail: string = await fs.readFileSync("../assets/templates/update.html", {encoding: 'utf-8'});
    mail = mail.replace("%%username%%", update.user.display);
    mail = mail.replace("%%code%%", update.code + "");
    mail = mail.replace("%%date%%", date.getFullYear() + "");

    let mailOptions = {
      from: config.emails.auth.user,
      to: update,
      subject: 'Actualización de correo',
      html: mail
    };

    // @ts-ignore
    return await this.mailClient.sendMail(mailOptions);
  }

}
