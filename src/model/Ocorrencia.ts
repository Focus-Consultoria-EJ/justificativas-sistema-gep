
export interface IOcorrenciaDTO
{
    id: number;
    data_ocorrido: string;
    id_tipo_ocorrencia: number;
    id_tipo_assunto: number;
    mensagem: string;
    valor_metragem: number;
    id_shark: number;
}

class Ocorrencia 
{
    private id?: number;
    private data_ocorrido?: Date;
    private id_tipo_ocorrencia: number;
    private id_tipo_assunto: number;
    private mensagem: string;
    private valor_metragem?: number;
    private id_shark: number;

    constructor({ id, data_ocorrido, id_tipo_ocorrencia, id_tipo_assunto, mensagem, valor_metragem, id_shark }: IOcorrenciaDTO)
    {
        this.id = id;
        this.data_ocorrido = new Date(data_ocorrido)
        this.id_tipo_ocorrencia = id_tipo_ocorrencia;
        this.id_tipo_assunto = id_tipo_assunto;     
        this.mensagem = mensagem;     
        this.valor_metragem = valor_metragem;        
        this.id_shark = id_shark;     
    }
    
    public getId(): number | undefined { return this.id; }

    public setDataOcorrido(dataOcorrido:Date): void { this.data_ocorrido = dataOcorrido; }
    public getDataOcorrido(): Date | undefined { return this.data_ocorrido; }

    public setIdTipoOcorrencia(id_tipo_ocorrencia:number): void { this.id_tipo_ocorrencia = id_tipo_ocorrencia; }
    public getIdTipoOcorrencia(): number { return this.id_tipo_ocorrencia; }

    public setIdTipoAssunto(id_tipo_assunto:number): void { this.id_tipo_assunto = id_tipo_assunto; }
    public getIdTipoAssunto(): number { return this.id_tipo_assunto; }
    
    public setMensagem(mensagem:string): void { this.mensagem = mensagem; }
    public getMensagem(): string { return this.mensagem; }

    public setValorMetragem(valor_metragem:number): void { this.valor_metragem = valor_metragem; }
    public getValorMetragem(): number | undefined { return this.valor_metragem; }

    public setIdShark(id_shark:number): void { this.id_shark = id_shark; }
    public getIdShark(): number | undefined { return this.id_shark; }
}

export default Ocorrencia;