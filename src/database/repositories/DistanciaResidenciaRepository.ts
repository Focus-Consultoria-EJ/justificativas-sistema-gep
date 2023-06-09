import db from "../db";
import { DistanciaResidencia } from "../../models/DistanciaResidencia";
import { TableNames } from "../TableNames";

class DistanciaResidenciaRepository
{
    async select(): Promise<DistanciaResidencia[] | undefined>
    {
        return await db(TableNames.distancia_residencia);
    }   
    
    async getById(id: number): Promise<any | undefined>
    {
        return await db(TableNames.distancia_residencia)
            .where({ id: id })
            .first();
    }

    async getByName(name: string): Promise<any | undefined>
    {
        const result = await db(TableNames.distancia_residencia)
            .where({ distancia: name })
            .first();

        if(!result)
            return false;
        else
            return true;
    }

    async insert(distanciaResidencia: DistanciaResidencia): Promise<any | undefined>
    {
        return await db(TableNames.distancia_residencia).insert({
            distancia: distanciaResidencia.distancia
        });
    }

    async update(distanciaResidencia: DistanciaResidencia): Promise<any | undefined>
    {
        return await db(TableNames.distancia_residencia)
            .update({
                distancia: distanciaResidencia.distancia
            })
            .where({ id: distanciaResidencia.id });
    }

    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.distancia_residencia)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new DistanciaResidenciaRepository;

