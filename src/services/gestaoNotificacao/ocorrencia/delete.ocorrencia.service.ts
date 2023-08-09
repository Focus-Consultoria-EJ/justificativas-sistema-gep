import SharkRepository from "../../../database/repositories/SharkRepository";
import OcorrenciaRepository from "../../../database/repositories/gestaoNotificacao/OcorrenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import ocEmailNotificaService from "../ocorrenciaEmailNotification/ocorrenciaEmailNotification.service";

class DeleteOcorrenciaService 
{
    /**
     * Serviço responsável pela remoção de uma ocorrência através do identificador.
     * @param id - o identificador do índice a ser removido.
     * @param reqShark - os dados do shark salvo na requisição do Express. 
     */
    async execute(id: any, reqShark: any): Promise<void>
    {
        id = checkId(id);

        const ocorrencia = await OcorrenciaRepository.getById(id);
        valueExists(ocorrencia, errMsg.OCORRENCIA.NOT_FOUND);
            
        await OcorrenciaRepository.delete(id).then(async () => {
            await OcorrenciaRepository.insertOcorrenciaLog(3, id, reqShark.id!);
            
            // Lança o E-mail (Primeiro/Segundo aviso, advertência, gratificação)
            if(ocorrencia?.valorMetragem !== 0 || ocorrencia?.tipoOcorrencia.id === 4)
            {
                const sharkReferente = await SharkRepository.getById(Number(ocorrencia?.sharkReferente.id));

                if(!sharkReferente)
                    throw new BadRequestError("Não foi possível enviar o e-mail pois o shark referente não foi encontrado.");
               
                ocEmailNotificaService.to = ocorrencia?.sharkReferente.email;
                const html = ocEmailNotificaService.notificationEmailOnDelete(sharkReferente, ocorrencia!); 
                await ocEmailNotificaService.sendMail(html);
            }
        });
        

    }
}

export default new DeleteOcorrenciaService;