import { TipoAssunto } from "../../models/TipoAssunto";
import { TableNames } from "../TableNames";
import db from "../db";

class TipoAssuntoRepository
{
    async select(): Promise<TipoAssunto[] | undefined>
    {
        return await db(TableNames.tipo_assunto);
    }   
    
    async getById(id: number): Promise<any | undefined>
    {
        return await db(TableNames.tipo_assunto)
            .where({ id: id })
            .first();
    }

    async getByName(nome: string): Promise<any | undefined>
    {
        const result = await db(TableNames.tipo_assunto)
            .where({ nome: nome })
            .first();

        if(!result)
            return false;
        else
            return true;
    }

    async insert(tipoAssunto: TipoAssunto): Promise<any | undefined>
    {
        return await db(TableNames.tipo_assunto).insert({
            nome: tipoAssunto.nome
        });
    }

    async update(tipoAssunto: TipoAssunto): Promise<any | undefined>
    {
        return await db(TableNames.tipo_assunto)
            .update({
                nome: tipoAssunto.nome
            })
            .where({ id: tipoAssunto.id });
    }

    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.tipo_assunto)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new TipoAssuntoRepository;

