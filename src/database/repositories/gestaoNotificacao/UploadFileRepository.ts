import { InternalServerError } from "../../../middlewares/Error.middleware";
import { UploadFile } from "../../../models/gestaoNotificacao/UploadFile";
import { TableNames } from "../../TableNames";
import db from "../../db";

class UploadFileRepository
{
    /**
     * Traz todos os dados da tabela upload_file no banco de dados.
     * @returns uma promise contendo uma coleção de objetos. 
     */
    async select(): Promise<UploadFile[] | undefined>
    {
        try
        {
            const data = await db(TableNames.upload_file).orderBy("id");

            const uploadFiles: UploadFile[] = data.map(file => ({
                id: file.id,
                googleDriveId: file.google_drive_id,
                nomeArquivo: file.nome_arquivo,
                tipoArquivo: file.tipo_arquivo,
                ocorrencia: file.id_ocorrencia,
                dataCriacao: file.data_criacao,
            }));

            return uploadFiles;
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }   
    
    /**
     * Traz uma linha da tabela upload_file no banco de dados de acordo com o id da ocorrência associada.
     * @param id - identificador relacionado ao id da ocorrência associada no banco de dados.
     * @returns uma promise contendo um objeto. 
     */
    async getByIdOcorrencia(idOcorrencia: number): Promise<UploadFile | undefined>
    {
        try
        {
            const data = await db(TableNames.upload_file)
                .where({ id_ocorrencia: idOcorrencia })
                .first();

            if(!data)
                return undefined;
            
            return {
                id: data.id,
                googleDriveId: data.google_drive_id,
                nomeArquivo: data.nome_arquivo,
                tipoArquivo: data.tipo_arquivo,
                ocorrencia: data.id_ocorrencia,
                dataCriacao: data.data_criacao,
            };
        }
        catch (err) { throw new InternalServerError(String(err)); }
    }

    /**
     * Insere o item na tabela upload_file no banco de dados.
     * @param tipoAssunto - um objeto do tipo UploadFile.
     * @returns - uma promise com as informações da inserção.
     */
    async insert(file: UploadFile): Promise<any | undefined>
    {
        return await db(TableNames.upload_file).insert({
            google_drive_id: file.googleDriveId,
            nome_arquivo: file.nomeArquivo,
            tipo_arquivo: file.tipoArquivo,
            id_ocorrencia: file.ocorrencia?.id,
            data_criacao: file.dataCriacao
        });
    }

    /**
     * Atualiza o item na tabela upload_file no banco de dados.
     * @param tipoAssunto - um objeto do tipo UploadFile.
     * @returns - uma promise com as informações da atualização.
     */
    async update(file: UploadFile): Promise<any | undefined>
    {
        return await db(TableNames.upload_file)
            .update({
                google_drive_id: file.googleDriveId,
                nome_arquivo: file.nomeArquivo,
                tipo_arquivo: file.tipoArquivo,
                id_ocorrencia: file.ocorrencia?.id,
                data_criacao: file.dataCriacao
            })
            .where({ id: file.id });
    }

    /**
     * Remove o item na tabela upload_file no banco de dados.
     * @param id - identificador relacionado a um item do banco de dados.
     * @returns uma promise com informações do item removido.
     */
    async delete(id: number): Promise<any | undefined>
    {
        return await db(TableNames.upload_file)
            .select()
            .where({ id: id })
            .del();
    }
}

export default new UploadFileRepository;

