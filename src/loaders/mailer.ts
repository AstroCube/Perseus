import * as nodemailer from "nodemailer";
import { TransportOptions } from "nodemailer";
import * as Mail from "nodemailer/lib/mailer";

export default async (opts: TransportOptions): Promise<Mail> => {
  return await nodemailer.createTransport(opts) as Mail;
}
