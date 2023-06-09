import { Celula } from "../../models/Celula";
import { TableNames } from "../TableNames";
import db from "../db";

class CelulaRepository
{
    async select(): Promise<Celula[] | undefined>
    {
        return await db(TableNames.celula);
    }   
    
    async getById(id: number): Promise<any | undefined>
    {
        return await db(TableNames.celula)
            .where({ id: id })
            .first();
    }

    async getByName(nome: string): Promise<any | undefined>
    {
        const result = await db(TableNames.celula)
            .where({ nome: nome })
            .first();

        if(!result)
            return false;
        else
            return true;

    }

    async insert(celula: Celula): Promise<any | undefined>
    {
        return await db(TableNames.celula).insert({
            nome: celula.nome
        });
    }

    async update(celula: Celula): Promise<any | undefined>
    {
        return await db(TableNames.celula)
            .update({
                nome: celula.nome
            })
            .where({ id: celula.id });
    }

    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.celula)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new CelulaRepository;

