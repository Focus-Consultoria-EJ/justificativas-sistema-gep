import db from "../db";
import { DistanciaResidencia } from "../../models/DistanciaResidencia";
import { TableNames } from "../TableNames";

class DistanciaResidenciaRepository
{
    /**
     * Traz todos os dados da tabela distancia_residencia no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<DistanciaResidencia[] | undefined>
    {
        return await db(TableNames.distancia_residencia);
    }   
    
    /**
     * Traz uma linha da tabela distancia_residencia no banco de dados de acordo com o id.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getById(id: number): Promise<DistanciaResidencia | undefined>
    {
        return await db(TableNames.distancia_residencia)
            .where({ id: id })
            .first();
    }

    /**
     * Verifica se a distancia já existe na tabela distancia_residencia.
     * @param distancia - o texto da distancia.
     * @returns uma promise do tipo boolean. 
     */
    async existsByName(distancia: string): Promise<boolean | undefined>
    {
        const result = await db(TableNames.distancia_residencia)
            .where({ distancia: distancia })
            .first();

        if(!result)
            return false;
        else
            return true;
    }

    /**
     * Insere o item na tabela distancia_residencia no banco de dados.
     * @param distanciaResidencia - um objeto do tipo DistanciaResidencia.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(distanciaResidencia: DistanciaResidencia): Promise<any | undefined>
    {
        return await db(TableNames.distancia_residencia).insert({
            distancia: distanciaResidencia.distancia
        });
    }

    /**
     * Atualiza o item na tabela distancia_residencia no banco de dados.
     * @param distanciaResidencia - um objeto do tipo DistanciaResidencia.
     * @returns - uma promise com as informações da atualização.
     */
    async update(distanciaResidencia: DistanciaResidencia): Promise<any | undefined>
    {
        return await db(TableNames.distancia_residencia)
            .update({
                distancia: distanciaResidencia.distancia
            })
            .where({ id: distanciaResidencia.id });
    }

    /**
     * Remove o item na tabela distancia_residencia no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.distancia_residencia)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new DistanciaResidenciaRepository;

