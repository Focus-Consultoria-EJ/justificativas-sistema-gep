import SharkRepository from "../../database/repositories/SharkRepository";

class getByUserSharkService 
{
    async execute(username:string)
    {
        return await SharkRepository.getByUsername(username);
    }
}

export default new getByUserSharkService;