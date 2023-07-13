import SharkRepository from "../../database/repositories/SharkRepository";

class getByUserSharkService 
{
    /**
     * Serviço responsável por trazer um shark através do e-mail.
     * @param email - e-mail relacionado ao item a ser retornado do banco de dados.
     * @returns uma promise contendo um objeto.
     */
    async execute(email:string)
    {
        return await SharkRepository.getByEmail(email);
    }
}

export default new getByUserSharkService;