import db from "../../config/connection";

class TipoOcorrenciaDAO
{
    // Verifica se o id está vinculado a uma cláusula válida
    async TipoOcorrenciaExists(id: number): Promise<any | undefined>
    {
        return await db("tipo_ocorrencia")
            .where({ id: id })
            .first();
            
    }
}

export default new TipoOcorrenciaDAO;

