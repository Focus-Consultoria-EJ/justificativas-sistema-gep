import db from "../../config/connection";
import fs from "fs";

class ImageSharkDAO
{
    async select(): Promise<any[] | undefined>
    {
        try
        {
            return await db("shark_image");
        }
        catch(err: any) { throw err.message; }
    }

    async insert(image: Object)
    {
        try
        {
            return await db("shark_image").insert(image);
        }
        catch(err: any) { throw err.message; }
    }

    async getImageBySharkId(id: number): Promise<any | undefined>
    {
        try
        {
            return await db("shark_image")
            .where({ id_shark: id})
            .first();
        }
        catch(err: any) { throw err.message; }
    }

    async delete(id: number): Promise<any | undefined>
    {
        try
        {
            return await db("shark_image")
            .select()
            .where({ id: id })
            .del();
        }
        catch(err: any) { throw err.message; }
    }

    async deleteImageFromPath(path: string)
    {
        try
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
        catch(err: any) { throw err.message; }
    }
}

export default new ImageSharkDAO;

