import OcorrenciaRepository from "../../database/repositories/OcorrenciaRepository";
import SharkRepository from "../../database/repositories/SharkRepository";
import TipoAssuntoRepository from "../../database/repositories/TipoAssuntoRepository";
import TipoOcorrenciaRepository from "../../database/repositories/TipoOcorrenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { ocorrenciaFormValidation } from "../../helpers/ocorrenciaValidation";
import { checkId, valueExists } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";
import { Ocorrencia } from "../../models/Ocorrencia";
import { Shark } from "../../models/Shark";
import emailService from "../email/email.service";

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
        
        // Se não tiver passado o shark_referente, pega o próprio shark
        ocorrencia.sharkReferente.id = ocorrencia.sharkReferente.id ? ocorrencia.sharkReferente.id : reqShark.id;

        const dataSharkReferente = await SharkRepository.getById(ocorrencia.sharkReferente.id!);
        valueExists(dataSharkReferente, errMsg.SHARK.REFERENCE_NOT_FOUND);
        
        if(ocorrencia.id)
        {
            ocorrenciaASerAtualizada = await OcorrenciaRepository.getById(ocorrencia.id!);

            if(!ocorrenciaASerAtualizada)
                throw new BadRequestError(errMsg.OCORRENCIA.NOT_FOUND);   
        }

        const tipoOcorrencia = await TipoOcorrenciaRepository.getById(ocorrencia.tipoOcorrencia.id!);
        valueExists(tipoOcorrencia, errMsg.TIPO_OCORRENCIA.NOT_FOUND);

        const tipoAssunto = await TipoAssuntoRepository.getById(ocorrencia.tipoAssunto.id!);
        valueExists(tipoAssunto, errMsg.TIPO_ASSUNTO.NOT_FOUND);

        ocorrencia.tipoOcorrencia.nome = tipoOcorrencia?.nome;
        ocorrencia.tipoAssunto.nome = tipoAssunto?.nome;

        // Faz com que somente sharks do tipo GEP consigam enviar um valor na metragem, os demais serão 0
        ocorrencia.valorMetragem = ocorrencia.valorMetragem && (reqShark.celula.id === 3) ? Number(ocorrencia.valorMetragem) : 0;
        
        // Seta o id do shark logado como shark criador da ocorrência
        ocorrencia.sharkCriador!.id = reqShark.id;

        // Se o shark referênte não for passado, pega o id do shark logado
        ocorrencia.sharkReferente.id = dataSharkReferente?.id ?? reqShark.id;

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
            // Impede que a ocorrência a ser atualizada se o shark referênte for diferente do shark referênte original da ocorrência.
            if(ocorrenciaASerAtualizada != undefined)
            {
                if(ocorrenciaASerAtualizada.sharkReferente.id !== ocorrencia.sharkReferente.id)
                    ocorrencia.sharkReferente.id = ocorrenciaASerAtualizada.sharkReferente.id;
            }

            await OcorrenciaRepository.update(ocorrencia).then(async idInserted => {
                await OcorrenciaRepository.insertOcorrenciaLog(2,idInserted, reqShark.id!);

                // Lança o E-mail (Primeiro/Segundo aviso, advertência, gratificação)
                if(ocorrencia.tipoOcorrencia.id && (ocorrencia.tipoOcorrencia.id >= 4 && ocorrencia.tipoOcorrencia.id <= 7))
                {
                    emailService.to = ocorrencia.sharkReferente.email;
                    const html = emailService.notificationEmail(ocorrencia.sharkReferente, ocorrencia); 
                    await emailService.sendMail(html);
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
                    emailService.to = ocorrencia.sharkReferente.email;
                    const html = emailService.notificationEmail(ocorrencia.sharkReferente, ocorrencia); 
                    await emailService.sendMail(html);
                }
            });
        }
    }
}

export default new SaveOcorrenciaService;