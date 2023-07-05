import OcorrenciaRepository from "../../database/repositories/OcorrenciaRepository";
import SharkRepository from "../../database/repositories/SharkRepository";
import TipoAssuntoRepository from "../../database/repositories/TipoAssuntoRepository";
import TipoOcorrenciaRepository from "../../database/repositories/TipoOcorrenciaRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { ocorrenciaFormValidation } from "../../helpers/ocorrenciaValidation";
import { checkId, valueExists } from "../../helpers/validation";
import { BadRequestError } from "../../middlewares/Error.middleware";
import { Ocorrencia } from "../../models/Ocorrencia";
import emailService from "../email/email.service";

class SaveOcorrenciaService 
{
    async execute(data: any, reqShark: any): Promise<void>
    {
        data.id = checkId(data.id);

        data = await ocorrenciaFormValidation(data);
        
        if(typeof data === "string")
            throw new BadRequestError(data);

        // Se não tiver passado o shark_referente, pega o próprio shark
        data.shark_referente = data.shark_referente ? data.shark_referente : reqShark.id;

        const dataSharkReferente = await SharkRepository.getById(data.shark_referente);
        valueExists(dataSharkReferente, errMsg.SHARK.REFERENCE_NOT_FOUND);
        
        if(data.id)
            if(!await OcorrenciaRepository.getById(data.id!))
                throw new BadRequestError(errMsg.OCORRENCIA.NOT_FOUND);   

        const tipoOcorrencia = await TipoOcorrenciaRepository.getById(data.tipo_ocorrencia!);
        valueExists(tipoOcorrencia, errMsg.TIPO_OCORRENCIA.NOT_FOUND);

        const tipoAssunto = await TipoAssuntoRepository.getById(data.tipo_assunto!);
        valueExists(tipoAssunto, errMsg.TIPO_ASSUNTO.NOT_FOUND);

        const ocorrencia: Ocorrencia = {
            id: data.id,
            dataOcorrido: data.data_ocorrido ?? new Date(),
            tipoOcorrencia: { id: tipoOcorrencia.id, nome: tipoOcorrencia.nome },
            tipoAssunto: { id: tipoAssunto.id, nome: tipoAssunto.nome },
            mensagem: data.mensagem,
            valorMetragem: data.valor_metragem && (reqShark.admin == 1) ? Number(data.valor_metragem) : 0,
            sharkCriador: reqShark,
            sharkReferente: dataSharkReferente ?? reqShark
        }; 

        // Bloqueia o usuário comum (não de GEP) de enviar uma ocorrência que não seja do tipo justificativa
        if(!String(reqShark.celula).toLocaleLowerCase().includes("gestão") && (ocorrencia.tipoOcorrencia.id != 1))
            throw new BadRequestError("Um usuário que não é de Gestão Estratégica de Pessoas só pode enviar ocorrências do tipo justificativa.");

        // Bloqueia o usuário comum (não de GEP) de enviar uma ocorrência relacionada a outro usuário
        if(!String(reqShark.celula).toLocaleLowerCase().includes("gestão") && (ocorrencia.sharkCriador.id != ocorrencia.sharkReferente.id))
            throw new BadRequestError("Um usuário que não é de Gestão Estratégica de Pessoas só pode criar ocorrências referente a ele mesmo.");
        
        // Define que o segundo aviso (id = 5) retire 2 de metragem
        if (ocorrencia.tipoOcorrencia.id == 5)
            ocorrencia.valorMetragem = 2;

        // Define que o primeiro aviso (id = 4) retire 0 de metragem
        if (ocorrencia.tipoOcorrencia.id == 4)
            ocorrencia.valorMetragem = 0;

        if(ocorrencia.id)
        {
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