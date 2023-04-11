import multerS3 from "multer-s3";
import dotenv from "dotenv";
dotenv.config();
import { S3Client } from '@aws-sdk/client-s3';
import multer from "multer";
import path from "path";

// Se o storage type não estiver setado, configura para ser s3
const STORAGE_TYPE = (process.env.STORAGE_TYPE != undefined) ? process.env.STORAGE_TYPE : "s3";

// S3 Config
const s3 = new S3Client({
    credentials: {
        accessKeyId: String(process.env.AWS_USER_ACCESS_KEY),
        secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY)
    },
    region: String(process.env.AWS_BUCKET_REGION)
});

const storageTypes:any = 
{
    local: multer.diskStorage({
        destination: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
        filename(req, file, cb)
        {
            cb(null, Date.now() + "_" + file.originalname);
        }
    }),
    s3: multerS3({
        s3,
        bucket: String(process.env.AWS_BUCKET_NAME),
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname })
        },
        key: (req, file, cb) => {
            cb(null, Date.now() + "-" + file.originalname);
        }
    })
};

// Configuração do multer para o upload de arquivos do tipo imagem
export default 
{
    storage: storageTypes[STORAGE_TYPE],
    limits: {
        fileSize: Number(process.env.MAX_SIZE)
    },
    fileFilter: (req: any, file: any, cb: any) => {
        const allowedMimes = [
            "image/jpeg",
            "image/jpg",
            "image/pjpeg",
            "image/png"
        ];

        if (allowedMimes.includes(file.mimetype))
            cb(null, true);
        else
            cb(new Error("Tipo de arquivo inválido."));
    }
}