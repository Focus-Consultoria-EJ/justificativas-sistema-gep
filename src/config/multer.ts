import multer from "multer";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

// Configuração do multer para o upload de arquivos do tipo imagem
export default 
{
    storage: multer.diskStorage({
        destination: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
        filename(req, file, cb)
        {
            cb(null, Date.now() + "_" + file.originalname);
        }
    }),
    limits: {
        fileSize: Number(process.env.MAX_SIZE)
    },
    fileFilter: (req: any, file: any, cb: any) => {
        const allowedMimes = [
            "image/jpeg",
            "image/pjpeg",
            "image/png",
            "image/gif"
        ];

        if (allowedMimes.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error("Tipo de arquivo inválido."));
    }
}