import Shark from "./Shark";
import TipoAssunto from "./TipoAssunto";
import TipoOcorrencia from "./TipoOcorrencia";

export interface IOcorrenciaDTO
{
    id: number;
    dataOcorrido: string;
    tipoOcorrencia: TipoOcorrencia;
    tipoAssunto: TipoAssunto;
    mensagem: string;
    valorMetragem: number;
    sharkCriador: Shark;
    sharkReferente: Shark;
    dataCriacao?: Date;
}

class Ocorrencia 
{
    private id?: number;
    private dataOcorrido?: Date;
    private tipoOcorrencia: TipoOcorrencia;
    private tipoAssunto: TipoAssunto;
    private mensagem: string;
    private valorMetragem?: number;
    private sharkCriador: Shark;
    private sharkReferente: Shark;
    private dataCriacao?: Date;

    constructor({ id, dataOcorrido, tipoOcorrencia, tipoAssunto, mensagem, valorMetragem, sharkCriador, sharkReferente, dataCriacao}: IOcorrenciaDTO)
    {
        this.id = id;
        this.dataOcorrido = dataOcorrido ? new Date(dataOcorrido) : new Date();
        this.tipoOcorrencia = tipoOcorrencia;
        this.tipoAssunto = tipoAssunto;     
        this.mensagem = mensagem;     
        this.valorMetragem = valorMetragem;        
        this.sharkCriador = sharkCriador;     
        this.sharkReferente = sharkReferente;     
        this.dataCriacao = dataCriacao ? new Date(dataCriacao) : new Date();
    }
    
    public getId(): number | undefined { return this.id; }

    public setDataOcorrido(dataOcorrido:Date): void { this.dataOcorrido = dataOcorrido; }
    public getDataOcorrido(): Date | undefined { return this.dataOcorrido; }

    public setTipoOcorrencia(tipoOcorrencia:TipoOcorrencia): void { this.tipoOcorrencia = tipoOcorrencia; }
    public getTipoOcorrencia(): TipoOcorrencia { return this.tipoOcorrencia; }

    public setTipoAssunto(tipoAssunto:TipoAssunto): void { this.tipoAssunto = tipoAssunto; }
    public getTipoAssunto(): TipoAssunto { return this.tipoAssunto; }
    
    public setMensagem(mensagem:string): void { this.mensagem = mensagem; }
    public getMensagem(): string { return this.mensagem; }

    public setValorMetragem(valorMetragem:number): void { this.valorMetragem = valorMetragem; }
    public getValorMetragem(): number | undefined { return this.valorMetragem; }

    public setSharkCriador(sharkCriador:Shark): void { this.sharkCriador = sharkCriador; }
    public getSharkCriador(): Shark | undefined { return this.sharkCriador; }

    public setSharkReferente(sharkReferente:Shark): void { this.sharkReferente = sharkReferente; }
    public getSharkReferente(): Shark | undefined { return this.sharkReferente; }

    public getDataCriacao(): Date | undefined { return this.dataCriacao; }
}

export default Ocorrencia;