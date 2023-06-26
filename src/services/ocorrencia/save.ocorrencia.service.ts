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

class SaveOcorrenciaService 
{
    async execute(data: any, reqShark: Shark): Promise<void>
    {
        data.id = checkId(data.id);

        data = await ocorrenciaFormValidation(data);
        
        if(typeof data === "string")
            throw new BadRequestError(data);

        let dataSharkReferente;

        if(data.shark_referente && data.shark_referente != reqShark.id)
        {
            dataSharkReferente = await SharkRepository.getById(data.shark_referente);
            valueExists(dataSharkReferente, errMsg.SHARK.REFERENCE_NOT_FOUND);
        }
        
        if(data.id)
            if(!await OcorrenciaRepository.getById(data.id!))
                throw new BadRequestError(errMsg.OCORRENCIA.NOT_FOUND);   

        const tipoOcorrencia = await TipoOcorrenciaRepository.getById(data.tipo_ocorrencia!);
        valueExists(tipoOcorrencia, errMsg.TIPO_OCORRENCIA.NOT_FOUND);

        const tipoAssunto = await TipoAssuntoRepository.getById(data.tipo_assunto!);
        valueExists(tipoAssunto, errMsg.TIPO_ASSUNTO.NOT_FOUND);

        /*-- Fim Valida os campos --*/

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

        // Bloqueia o usuário comum de enviar uma ocorrência que não seja do tipo justificativa
        if((reqShark.admin != 1) && (ocorrencia.tipoOcorrencia.id != 1))
            throw new BadRequestError("Usuário não administrador só pode enviar ocorrências do tipo justificativa.");

        // Bloqueia o usuário comum de enviar uma ocorrência relacionada a outro usuário
        if((reqShark.admin != 1) && (ocorrencia.sharkCriador.id != ocorrencia.sharkReferente.id))
            throw new BadRequestError("Usuário não administrador só pode criar ocorrências referente a ele mesmo.");
        
        if(ocorrencia.id)
        {
            await OcorrenciaRepository.update(ocorrencia).then(async idInserted => {
                await OcorrenciaRepository.insertOcorrenciaLog(2,idInserted, reqShark.id!);
            });
        }
        else
        {
            await OcorrenciaRepository.insert(ocorrencia).then(async idInserted => {
                await OcorrenciaRepository.insertOcorrenciaLog(1,idInserted, reqShark.id!);
            });
        }
    }
}

export default new SaveOcorrenciaService;