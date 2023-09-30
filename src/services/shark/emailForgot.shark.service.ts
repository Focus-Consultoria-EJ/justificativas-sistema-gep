import { InternalServerError } from "../../middlewares/Error.middleware";
import { Shark } from "../../models/Shark";
import emailService from "../email/email.service";
import dotenv from "dotenv";
dotenv.config();

class emailForgotShark extends emailService
{
    /**
     * Cria o template html enviado por e-mail.
     */
    forgotTemplateHTML(shark: Shark, token: string)
    {
        if(!process.env.URL_FRONT_END)
            throw new InternalServerError("A variável de ambiente URL_FRONT_END não está definida.");

        this.subject = "Redifinição de senha";
        this.to = shark.email;

        const html = `
            <div class="wrapper" style="color: black; max-width: 700px; margin: 0 auto; height: 100vh;">
                <h2>Redefinição de Senha</h2>
                <p>Olá shark ${shark.nome}. <br>
                    Clique no link abaixo para redefinir a sua senha:</p>
                <a href="${process.env.URL_FRONT_END}/reset-password?token=${token}">Redefinir senha</a>
                <br><br>
                <small style="color: #DAA520;">Este link expira em 30 minutos.</small>
            </div>
        `;

        return html;
    }
}

export default new emailForgotShark;