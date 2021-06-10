import nodemailer, { Transporter } from "nodemailer";
import fs from "fs";
import handlebars from "handlebars";

class SendMailService {
  private client: Transporter;

  constructor() {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    });

    this.client = transporter;
    // nodemailer.createTestAccount().then((account) => {
    //   const transporter = nodemailer.createTransport({
    //     host: account.smtp.host,
    //     port: account.smtp.port,
    //     secure: account.smtp.secure,
    //     auth: {
    //       user: account.user,
    //       pass: account.pass,
    //     },
    //   });

    //   this.client = transporter;
    // });
  }

  async execute(to: string, subject: string, variables: object, path: string) {
    const templateFileContent = fs.readFileSync(path).toString("utf8");

    const mailtemplateParse = handlebars.compile(templateFileContent);

    const html = mailtemplateParse(variables);

    const message = await this.client.sendMail({
      to,
      subject,
      html,
      from: "BeHair <noreplay@behair.com.br>",
    });

    // console.log("message sent: %s", message.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}

export default new SendMailService();
