import SharkRepository from "../../database/repositories/SharkRepository";
import { errMsg } from "../../helpers/ErrorMessages";
import { checkId, valueExists } from "../../helpers/validation";
import { InternalServerError } from "../../middlewares/Error.middleware";
import { Shark } from "../../models/Shark";

class DeleteSharkService 
{
    async execute(id: any, reqShark:Shark): Promise<void>
    {
        id = checkId(id);

        const result = await SharkRepository.getById(id);
        valueExists(result, errMsg.SHARK.NOT_FOUND);

        if(reqShark)
        {
            await SharkRepository.delete(id);
            await SharkRepository.insertSharkLog(3, id, reqShark.id!);
        }
        else
            throw new InternalServerError("O shark da requisição não está setado");
    }
}

export default new DeleteSharkService;