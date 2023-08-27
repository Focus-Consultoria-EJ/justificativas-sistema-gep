import { google } from "googleapis";
import path from "path";
import { Stream } from "stream";
import { InternalServerError } from "../middlewares/Error.middleware";
import fs from "fs";
import dotenv from "dotenv";
import { ENABLE_UPLOAD_FILES } from "./multer";
dotenv.config();

const GOOGLE_CREDENTIALS = path.join(__dirname + "/google_api_credentials.json");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const ID_FOLDER_GOOGLE_DRIVE = process.env.ID_GOOGLE_FOLDER || "";

// Verificar se o arquivo de credenciais existe
if (!fs.existsSync(GOOGLE_CREDENTIALS) && ENABLE_UPLOAD_FILES) {
    console.error("O arquivo de credenciais não foi encontrado.");
    process.exit(1);
}

// Verificar se o id da pasta do google foi passado
if(ID_FOLDER_GOOGLE_DRIVE === "" && ENABLE_UPLOAD_FILES)
{
    console.error("O id da pasta do google drive não foi passado nas variáveis de ambiente.");
    process.exit(1);
}

// Configuração da API do Google Drive
const auth = new google.auth.GoogleAuth({ keyFile: GOOGLE_CREDENTIALS, scopes: SCOPES, });
  
export async function uploadFileToDrive(file: Express.Multer.File) 
{
    const drive = google.drive({ version: "v3", auth: auth });

    const newFilename = replaceFilename(file.originalname);
    const fileMetadata = { 
        name: newFilename,
        parents: [ID_FOLDER_GOOGLE_DRIVE]  // Id da pasta no google drive
    };

    const bufferStream = new Stream.PassThrough();
    bufferStream.end(file.buffer);
   
    const res = await drive.files.create({
        requestBody: fileMetadata,
        media: {
            mimeType: file.mimetype,
            body: bufferStream,
        },
        fields: "id,name",
    })
        .catch (err => { 
            if(String(err).includes("File not found"))
                throw new InternalServerError("O id da pasta no google drive é inválido. " + err); 
            else
                throw new InternalServerError(`Erro ao inserir o arquivo no drive: ${err}`); 
        });  
    
    return { idGoogle: res.data.id, filename: newFilename };
}

export async function removeFileFromDrive(fileIdGoogle: string) 
{
    const drive = google.drive({ version: "v3", auth: auth });

    return await drive.files.delete({ fileId: fileIdGoogle })
        .catch (err => { throw new InternalServerError(`Erro ao apagar arquivo no drive: ${err}`); });
}

/**
 *  Função para remover todos os arquivos do Google Drive (Usado no schedule)
 * */ 
export async function removeAllFilesFromDrive() 
{
    try 
    {
        const drive = google.drive({ version: "v3", auth: auth });
        
        const files = await drive.files.list({
            q: `'${ID_FOLDER_GOOGLE_DRIVE}' in parents`, // Id da pasta no Google Drive
            fields: "files(id)",
        });

        for (const file of files.data.files!) 
            await removeFileFromDrive(file.id!);
        
        console.log("Todos os arquivos foram removidos com sucesso do Google Drive.");
    } 
    catch (error) 
    {
        console.error("Ocorreu um erro ao remover os arquivos: ", String(error));
    }
}

export const replaceFilename = (filename: string) => {
    const lowercaseString = filename.toLowerCase();
    const alphanumericOnly = lowercaseString.replace(/[^a-zA-Z0-9 .]/g, ""); // Adicione o ponto aqui
    const transformed = alphanumericOnly.replace(/ /g, "_");

    const timestamp = Date.now();
    const maxLength = 200 - String(timestamp).length - 1; // 1 character for the underscore

    const truncatedString = transformed.substring(0, maxLength);
    return `${timestamp}_${truncatedString}`;
};


