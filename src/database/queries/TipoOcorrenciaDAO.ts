import db from "../../config/connection";
import TipoOcorrencia from "../../model/TipoOcorrencia";

class TipoOcorrenciaDAO
{
    // Verifica se o id está vinculado a uma cláusula válida
    async TipoOcorrenciaExists(id: number): Promise<any | undefined>
    {
        try
        {
            return await db("tipo_ocorrencia")
            .where({ id: id })
            .first();
        }
        catch(err: any) { throw err.message; }
            
    }

    async select(): Promise<TipoOcorrencia[] | undefined>
    {
        try { return await db("tipo_ocorrencia"); }
        catch(err: any) { throw err.message; }
    }   

    async getById(id: number): Promise<any | undefined>
    {
        return await db("tipo_ocorrencia")
            .where({ id: id })
            .first();
    }

    async getByName(nome: string): Promise<any | undefined>
    {
        try 
        {
            const result = await db("tipo_ocorrencia")
            .where({ nome: nome })
            .first();

            if(!result)
                return false;
            else
                return true;
        }
        catch(err: any) { throw err.message; }
    }

    async insert(tipoOcorrencia: TipoOcorrencia): Promise<any | undefined>
    {
        try
        {
            return await db("tipo_ocorrencia").insert({
                nome: tipoOcorrencia.getNome()
            });
        }
        catch(err: any) { throw err.message; }
    }

    async update(tipoOcorrencia: TipoOcorrencia): Promise<any | undefined>
    {
        try
        {
            return await db("tipo_ocorrencia")
            .update({
                nome: tipoOcorrencia.getNome()
            })
            .where({ id: tipoOcorrencia.getId() });
        }
        catch(err: any) { throw err.message; }
    }

    async delete(id: number): Promise<any | undefined>
    {
        try
        {
            return await db("tipo_ocorrencia")
            .select()
            .where({ id: id })
            .where("id", "<>", 6)
            .where("id", "<>", 7)
            .del();
        }
        catch(err: any) { throw err.message; }
    }
}

export default new TipoOcorrenciaDAO;

