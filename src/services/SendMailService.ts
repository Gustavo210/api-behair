import nodemailer, { Transporter } from "nodemailer";


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

  async execute(to: string, subject: string, variables: { name: string, link: string }) {
    const html = `<style> .container{width: 800px;justify-content: center;align-items: center;align-content: center;display: flex;flex-direction: column;}.link{padding:10px;margin: 5px;background: #0A3473;color: #fff;border-radius: 2px;text-align: center;text-decoration: none;}.recover{width: 350px;display:flex;justify-content: center;align-items: center;}</style><div class="container"><label >Olá <strong>${ variables.name }</strong>! </label><span>Parece que você precisa recuperar sua senha.</span><br><strong>Click no link abaixo.</strong><div class="recover"><a class="link" href="${ variables.link }">Recuperar</a></div><br><br><h3>Equipe | <strong>BeHair</strong></h3></div>`;

    await this.client.sendMail({
      to,
      subject,
      html,
      from: "BeHair <noreplay@behair.com.br>",
    });

  }
}

export default new SendMailService();
