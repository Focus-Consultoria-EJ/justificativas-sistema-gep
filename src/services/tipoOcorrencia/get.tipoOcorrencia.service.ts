import TipoOcorrenciaRepository from "../../database/repositories/TipoOcorrenciaRepository";

class getTipoOcorrenciaService 
{
    async execute()
    {
        return await TipoOcorrenciaRepository.select();
    }
}

export default new getTipoOcorrenciaService;