import db from "../../config/connection";
import TipoAssunto from "../../model/TipoAssunto";

class TipoAssuntoDAO
{
    // Verifica se o id está vinculado a uma cláusula válida
    async TipoAssuntoExists(id: number): Promise<any | undefined>
    {
        try
        {
            return await db("tipo_assunto")
            .where({ id: id })
            .first();
        }
        catch(err: any) { throw err.message; }
    }

    async select(): Promise<TipoAssunto[] | undefined>
    {
        try
        {
            return await db("tipo_assunto");
        }
        catch(err: any) { throw err.message; }
    }   
    
    async getById(id: number): Promise<any | undefined>
    {
        try
        {
            return await db("tipo_assunto")
            .where({ id: id })
            .first();
        }
        catch(err: any) { throw err.message; }
    }

    async getByName(nome: string): Promise<any | undefined>
    {
        try 
        {
            const result = await db("tipo_assunto")
            .where({ nome: nome })
            .first();

            if(!result)
                return false;
            else
                return true;
        }
        catch(err: any) { throw err.message; }
    }

    async insert(tipoAssunto: TipoAssunto): Promise<any | undefined>
    {
        try
        {
            return await db("tipo_assunto").insert({
                nome: tipoAssunto.getNome()
            });
        }
        catch(err: any) { throw err.message; }
    }

    async update(tipoAssunto: TipoAssunto): Promise<any | undefined>
    {
        try
        {
            return await db("tipo_assunto")
            .update({
                nome: tipoAssunto.getNome()
            })
            .where({ id: tipoAssunto.getId() });
        }
        catch(err: any) { throw err.message; }
    }

    async delete(id: number): Promise<any | undefined>
    {
        try
        {
            return await db("tipo_assunto")
            .select()
            .where({ id: id })
            .del();
        }
        catch(err: any) { throw err.message; }
    }
}

export default new TipoAssuntoDAO;

