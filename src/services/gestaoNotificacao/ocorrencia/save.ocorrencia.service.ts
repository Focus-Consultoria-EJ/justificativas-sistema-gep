import SharkRepository from "../../../database/repositories/SharkRepository";
import OcorrenciaRepository from "../../../database/repositories/gestaoNotificacao/OcorrenciaRepository";
import TipoAssuntoRepository from "../../../database/repositories/gestaoNotificacao/TipoAssuntoRepository";
import TipoOcorrenciaRepository from "../../../database/repositories/gestaoNotificacao/TipoOcorrenciaRepository";
import { errMsg } from "../../../helpers/ErrorMessages";
import { ocorrenciaFormValidation } from "../../../helpers/gestaoNotificacao/ocorrenciaValidation";
import { checkId, valueExists } from "../../../helpers/validation";
import { BadRequestError } from "../../../middlewares/Error.middleware";
import { Shark } from "../../../models/Shark";
import ocEmailNotificaService from "../ocorrenciaEmailNotification/ocorrenciaEmailNotification.service";

class SaveOcorrenciaService 
{
    /**
     * Serviço responsável pela inserção ou atualização de uma ocorrência se o id for passado no parâmetro data.
     * @param data - os dados vindos do header.
     * @param reqShark - os dados do shark salvo na requisição do Express.
     */
    async execute(data: any, reqShark: Shark): Promise<void>
    {
        data.id = checkId(data.id);
        
        const ocorrencia = await ocorrenciaFormValidation(data);
        let ocorrenciaASerAtualizada;
        
        if(typeof ocorrencia === "string")
            throw new BadRequestError(ocorrencia);

        if(ocorrencia.id)
        {
            ocorrenciaASerAtualizada = await OcorrenciaRepository.getById(ocorrencia.id!);

            if(!ocorrenciaASerAtualizada)
                throw new BadRequestError(errMsg.OCORRENCIA.NOT_FOUND);   

            // Impede que a ocorrência a ser atualizada se o shark referênte for diferente do shark referênte original da ocorrência.
            if(ocorrenciaASerAtualizada != undefined)
            {
                if(ocorrenciaASerAtualizada.sharkReferente.id !== ocorrencia.sharkReferente.id)
                    ocorrencia.sharkReferente.id = ocorrenciaASerAtualizada.sharkReferente.id;
            }
        }

        // Seta o id do shark logado como shark criador da ocorrência
        ocorrencia.sharkCriador!.id = reqShark.id;

        // Se não tiver passado o sharkReferente, pega o próprio shark
        ocorrencia.sharkReferente.id = ocorrencia.sharkReferente.id ? ocorrencia.sharkReferente.id : reqShark.id;

        const dataSharkReferente = await SharkRepository.getById(ocorrencia.sharkReferente.id!);
        valueExists(dataSharkReferente, errMsg.SHARK.REFERENCE_NOT_FOUND);

        const tipoOcorrencia = await TipoOcorrenciaRepository.getById(ocorrencia.tipoOcorrencia.id!);
        valueExists(tipoOcorrencia, errMsg.TIPO_OCORRENCIA.NOT_FOUND);

        const tipoAssunto = await TipoAssuntoRepository.getById(ocorrencia.tipoAssunto.id!);
        valueExists(tipoAssunto, errMsg.TIPO_ASSUNTO.NOT_FOUND);

        ocorrencia.tipoOcorrencia.nome = tipoOcorrencia?.nome;
        ocorrencia.tipoAssunto.nome = tipoAssunto?.nome;
        ocorrencia.sharkReferente = dataSharkReferente!; // salva os dados do shark referente

        // Faz com que somente sharks do tipo GEP consigam enviar um valor na metragem, os demais serão 0
        ocorrencia.valorMetragem = ocorrencia.valorMetragem && 
            (reqShark.celula.id === 3) ? Number(ocorrencia.valorMetragem) : 0;
        
        // Bloqueia o usuário comum (não de GEP) de enviar uma ocorrência que não seja do tipo justificativa
        if(reqShark.celula.id !== 3 && (ocorrencia.tipoOcorrencia.id != 1))
            throw new BadRequestError("Um usuário que não é de Gestão Estratégica de Pessoas só pode enviar ocorrências do tipo justificativa.");

        // Bloqueia o usuário comum (não de GEP) de enviar uma ocorrência relacionada a outro usuário
        if(reqShark.celula.id !== 3 && (ocorrencia.sharkCriador?.id != ocorrencia.sharkReferente.id))
            throw new BadRequestError("Um usuário que não é de Gestão Estratégica de Pessoas só pode criar ocorrências referente a ele mesmo.");

        // Define que uma ocorrência do tipo justificativa retire 0 de metragem
        if (ocorrencia.tipoOcorrencia.id == 1)
            ocorrencia.valorMetragem = 0;
        
        // Define que o primeiro aviso (id = 4) retire 0 de metragem
        if (ocorrencia.tipoOcorrencia.id == 4)
            ocorrencia.valorMetragem = 0;

        // Define que o segundo aviso (id = 5) retire 2 de metragem
        if (ocorrencia.tipoOcorrencia.id == 5)
            ocorrencia.valorMetragem = 2;
            
        if(ocorrencia.id)
        {
            await OcorrenciaRepository.update(ocorrencia).then(async idInserted => {
                await OcorrenciaRepository.insertOcorrenciaLog(2,idInserted, reqShark.id!);

                // Lança o E-mail (Primeiro/Segundo aviso, advertência, gratificação)
                if(ocorrencia.tipoOcorrencia.id && (ocorrencia.tipoOcorrencia.id >= 4 && ocorrencia.tipoOcorrencia.id <= 7))
                {
                    ocEmailNotificaService.to = ocorrencia.sharkReferente.email;
                    const html = ocEmailNotificaService.notificationEmail(ocorrencia.sharkReferente, ocorrencia); 
                    await ocEmailNotificaService.sendMail(html);
                }
            });
        }
        else
        {
            await OcorrenciaRepository.insert(ocorrencia).then(async idInserted => {
                await OcorrenciaRepository.insertOcorrenciaLog(1,idInserted, reqShark.id!);

                // Lança o E-mail (Primeiro/Segundo aviso, advertência, gratificação)
                if(ocorrencia.tipoOcorrencia.id && (ocorrencia.tipoOcorrencia.id >= 4 && ocorrencia.tipoOcorrencia.id <= 7))
                {
                    ocEmailNotificaService.to = ocorrencia.sharkReferente.email;
                    const html = ocEmailNotificaService.notificationEmail(ocorrencia.sharkReferente, ocorrencia); 
                    await ocEmailNotificaService.sendMail(html);
                }
            });
        }
    }
}

export default new SaveOcorrenciaService;