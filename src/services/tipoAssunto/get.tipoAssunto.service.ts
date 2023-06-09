import TipoAssuntoRepository from "../../database/repositories/TipoAssuntoRepository";

class getTipoAssuntoService 
{
    async execute()
    {
        return await TipoAssuntoRepository.select();
    }
}

export default new getTipoAssuntoService;