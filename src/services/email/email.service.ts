import { SendMailOptions} from "nodemailer";
import transport from "../../config/nodemailer";


abstract class EmailService
{
    public to: any; 
    public subject: any;
    public message: any;
    
    /**
     * @param to - o e-mail de destino.
     * @param subject - o assunto do e-mail.
     * @param message - a mensagem do e-mail.
     */
    constructor(to?: string, subject?: string, message?: string) 
    { 
        this.to = to;
        this.subject = subject;
        this.message = message;
    }

    /**
     * Envia o e-mail.
     * @param html - um template html, se não passado o corpo do e-mail
     * será o message passado na instância da classe. 
     */
    async sendMail(html?: string)
    {
        let mailOptions: SendMailOptions;

        if(html)
        {
            mailOptions = {
                from: process.env.MAILER_AUTH_USER,
                to: this.to,
                subject: this.subject,
                text: this.message,
                html: html
            };
        }
        else
        {
            mailOptions = {
                from: process.env.MAILER_AUTH_USER,
                to: this.to,
                subject: this.subject,
                text: this.message
            };
        }

        return await transport.sendMail(mailOptions, (err) => {
            if(err)
            {
                console.log(`Erro ao enviar o e-mail: ${err}`);
                return err;
            }

            transport.close();
        });
    }
}

export default EmailService;