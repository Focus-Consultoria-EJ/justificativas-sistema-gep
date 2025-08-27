import { CustomError } from "../../../middlewares/Error.middleware";
import { Shark } from "../../../models/Shark";

enum Assuntos_Ocorrencia {
    "Plantão" = 1,
    "Reunião de célula" = 2,
    "Reunião geral" = 3,
    "Reunião de projetos" = 4,
    "Shark in ou Shark out" = 5,
    "Treinamento" = 6,
    "Outros" = 7,
    "Acompanhamento" = 13
}

class OcorrenciaTelegram
{
    async enviarParaTelegram(
        Mensagem : any,
        SharkRemetente: any
    ): Promise <void>
    {
        /**
         * @param Mensagem - Informações da mensagem
         * @param SharkRemetente - Informações do Shark
         */

        // Pegando as credenciais do bot e do chat do telegram
        const token_bot = process.env.TELEGRAM_TOKEN_BOT;
        const id_chat = process.env.TELEGRAM_ID_CHAT;
        // Verificação de erro
        if(!token_bot || !id_chat)
        {
            throw new CustomError("token do bot ou id do chat inválidos",500);
        }

/* Formatando a mensagem que será enviada pelo telegram */
        const mensagemTexto = 
`*🚨 Ocorrência Recebida 🚨*

*Informações do shark:*
Nome: ${SharkRemetente.nome}
Email: ${SharkRemetente.email}

*Informações da ocorrência:*
Tipo da ocorrência: Justificativa
Tipo de assunto: ${Assuntos_Ocorrencia[Mensagem.tipoAssunto]}

*Mensagem:*
${Mensagem.mensagem}`
/* Fim da formatação da mensagem */

        const url = `https://api.telegram.org/bot${token_bot}/sendMessage`; // API do Telegram
        // Utilizando o Fetch
        const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8",
                },
                body: JSON.stringify({
                    chat_id: id_chat,
                    text: mensagemTexto,
                    parse_mode: 'Markdown'
                }),
            });

        const result = await response.json();

        if (!result.ok)
        {
            throw new CustomError("erro de requisição",500);
        }   
    }
}

export default new OcorrenciaTelegram;
