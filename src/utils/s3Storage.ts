import { DeleteObjectCommand, PutObjectCommand, S3 } from '@aws-sdk/client-s3';

// Classe responsável por salvar e excluir as imagens no amazon S3
class S3Storage 
{
  private client: S3;

  constructor() 
  {
    this.client = new S3({
        credentials: {
            accessKeyId: String(process.env.AWS_USER_ACCESS_KEY),
            secretAccessKey: String(process.env.AWS_SECRET_ACCESS_KEY)
        },
        region: String(process.env.AWS_BUCKET_REGION)
    });
  }

  async saveFile(file: Express.MulterS3.File) 
  {
    const params = {
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: file?.key,
      Body: Buffer.alloc(file.size), // Aloca um espaço de memória com o tamanho do arquivo
      ContentType: file?.mimetype,
    }

    const command = new PutObjectCommand(params);
    return await this.client.send(command);
  }

  async deleteFile(key: string) {
    
    const params = {
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: key
    }
    
    const command = new DeleteObjectCommand(params);
    return await this.client.send(command)
  }
}

export default S3Storage;