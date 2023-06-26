import { SendMailOptions} from "nodemailer";
import transport from "../../config/nodemailer";

class EmailService
{
    public to: any; 
    public subject: any;
    public message: any;
    
    constructor(to?: string, subject?: string, message?: string) 
    { 
        this.to = to;
        this.subject = subject;
        this.message = message;
    }

    async sendMail()
    {
        const mailOptions: SendMailOptions = {
            from: process.env.MAILER_AUTH_USER,
            to: this.to,
            subject: this.subject,
            html: this.message
        };

        console.log(mailOptions);

        transport.sendMail(mailOptions, (err, info) => {
            if(err)
                return err;
            else
                return "E-mail enviado com sucesso.";
        });
    }
}

export default new EmailService;