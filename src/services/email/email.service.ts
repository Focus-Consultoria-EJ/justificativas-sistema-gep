import { SendMailOptions} from "nodemailer";
import transport from "../../config/nodemailer";
import { Shark } from "../../models/Shark";
import { Ocorrencia } from "../../models/Ocorrencia";

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

    notificationEmail(shark: Shark, ocorrencia: Ocorrencia, tipoOcorrencia: string, motivoNotificacao:string, dataOcorrido?: Date)
    {
        let metragemAtual = shark.metragem!;
        let linhaAtualizacao = "";
        tipoOcorrencia = tipoOcorrencia.toLowerCase();

        if(tipoOcorrencia.includes("aviso"))
            if(tipoOcorrencia.includes("primeiro"))
                tipoOcorrencia = "Aviso Comum";
            else if(tipoOcorrencia.includes("segundo"))
                tipoOcorrencia = "Segundo aviso";

        if(tipoOcorrencia.includes("gratifica"))
        {
            metragemAtual += ocorrencia.valorMetragem;
            linhaAtualizacao = "Metragem a ganhar com a ";
        }
        else if(tipoOcorrencia.includes("advert"))
        {
            metragemAtual -= ocorrencia.valorMetragem;
            linhaAtualizacao = "Metragem a perder com a ";
        }
        else if(tipoOcorrencia.includes("Segundo"))
        {
            metragemAtual -= ocorrencia.valorMetragem;
            linhaAtualizacao = "Metragem a perder com o ";
        }
            
            
        // Define o primeiro caractere para maiúsculo
        tipoOcorrencia = tipoOcorrencia.charAt(0).toUpperCase() + tipoOcorrencia.slice(1);
        this.subject = tipoOcorrencia;

        const html = `
            <style>mark { background-color: #fde293;} </style>
            <div class="wrapper" style="color: black; max-width: 700px; margin: 0 auto; height: 100vh;">
                <h2>${tipoOcorrencia}</h2>
                <p>
                    Olá, shark ${shark.nome}. Como você está? <br>
                    O GEP vem por meio desse e-mail, informar que você está recebendo um  <mark>${tipoOcorrencia}<mark>.
                    <ul>
                        <li><b>Motivo</b>: ${ocorrencia.motivo}</li>
                        <li><b>Na data</b>: ${dataOcorrido ?? ocorrencia.dataOcorrido}</li>
                        <li><b>Situação anterior do Shark</b>:  ${shark.metragem}</li>
                        <li><b>${linhaAtualizacao}<mark>${tipoOcorrencia}</mark></b>:  ${ocorrencia.valorMetragem}</li>
                        <li><b>Situação atual do Shark</b>:  ${metragemAtual}</li>
                        <li><b>Sistema de metragem</b>: Conversa com o GEP, 14 metros; Conversa com a DE, 8 metros;
                        Desligamento, 0 metros.</li>
                        <li><b>Sistema de avisos</b>: O shark poderá recerber inúmeros avisos, porém sendo contabilizado cada um como "aviso comum" ou "segundo aviso". Após ter recebido o 2º aviso, a contagem irá zerar, então o próximo irá ser um "aviso comum" e em seguida "segundo aviso", e assim sucessivamente. 
                        <u>No 2º aviso o shark irá perder 2 metros.</u></li>
                    </ul>

                    Estamos disponíveis para sanar qualquer dúvida a respeito dessa situação e reafirmamos que você pode contar conosco caso haja alguma questão influenciando seu desempenho e/ou sua motivação com a empresa.
                    Cada membro importa! Contamos com você, ${shark.nome}!
                </p>
            </div>
        `;

        return html;
    }
}

export default new EmailService;