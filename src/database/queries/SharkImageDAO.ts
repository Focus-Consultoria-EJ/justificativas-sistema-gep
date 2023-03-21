import db from "../../config/connection";
import fs from "fs";

class ImageSharkDAO
{
    async select(): Promise<any[] | undefined>
    {
        return await db("shark_image");
    }

    async insert(image: Object)
    {
        return await db("shark_image").insert(image);
    }

    async getImageBySharkId(id: number): Promise<any | undefined>
    {
        return await db("shark_image")
            .where({ id_shark: id})
            .first();
    }

    async delete(id: number): Promise<any | undefined>
    {
        return await db("shark_image")
            .select()
            .where({ id: id })
            .del();
    }

    async deleteImageFromPath(path: string)
    {
        return await fs.stat(path, (err, stats) => {
            if(err)
                return console.log(err);
            
            fs.unlink(path, (err) => {
                if(err)
                    return console.log("Error ao deletar: " + err)
            })
        });
    }
}

export default new ImageSharkDAO;

