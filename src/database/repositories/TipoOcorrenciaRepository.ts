import { TipoOcorrencia } from "../../models/TipoOcorrencia";
import { TableNames } from "../TableNames";
import db from "../db";

class TipoOcorrenciaRepository
{
    async select(): Promise<TipoOcorrencia[] | undefined>
    {
        return await db(TableNames.tipo_ocorrencia);
    }   
    
    async getById(id: number): Promise<any | undefined>
    {
        return await db(TableNames.tipo_ocorrencia)
            .where({ id: id })
            .first();
    }

    async getByName(nome: string): Promise<any | undefined>
    {
        const result = await db(TableNames.tipo_ocorrencia)
            .where({ nome: nome })
            .first();

        if(!result)
            return false;
        else
            return true;

    }

    async insert(tipoOcorrencia: TipoOcorrencia): Promise<any | undefined>
    {
        return await db(TableNames.tipo_ocorrencia).insert({
            nome: tipoOcorrencia.nome
        });
    }

    async update(tipoOcorrencia: TipoOcorrencia): Promise<any | undefined>
    {
        return await db(TableNames.tipo_ocorrencia)
            .update({
                nome: tipoOcorrencia.nome
            })
            .where({ id: tipoOcorrencia.id });
    }

    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.tipo_ocorrencia)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new TipoOcorrenciaRepository;

