import CelulaRepository from "../../database/repositories/CelulaRepository";

class getCelulaService 
{
    async execute()
    {
        return await CelulaRepository.select();
    }
}

export default new getCelulaService;