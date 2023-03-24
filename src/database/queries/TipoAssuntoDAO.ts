import db from "../../config/connection";

class TipoAssuntoDAO
{
    // Verifica se o id está vinculado a uma cláusula válida
    async TipoAssuntoExists(id: number): Promise<any | undefined>
    {
        return await db("tipo_assunto")
            .where({ id: id })
            .first();
    }
}

export default new TipoAssuntoDAO;

