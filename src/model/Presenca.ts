import Shark from "./Shark";
import Evento from "./Evento";

export interface IOPresencaDTO
{
    id: number;
    shark: Shark;
    evento: Evento
    confirmado: number;
    dataCriacao?: Date;
}

class Presenca 
{
    private id?: number;
    private shark: Shark;
    private evento: Evento;
    private confirmado: number;
    private dataCriacao?: Date;

    constructor({ id, shark, evento, confirmado, dataCriacao }: IOPresencaDTO)
    {
        this.id = id;
        this.shark = shark;
        this.evento = evento;
        this.confirmado = confirmado;     
        this.dataCriacao = dataCriacao ? new Date(dataCriacao) : new Date();
    }
    
    public getId(): number | undefined { return this.id; }

    public setShark(shark:Shark): void { this.shark = shark; }
    public getShark(): Shark  { return this.shark; }

    public setEvento(evento:Evento): void { this.evento = evento; }
    public getEvento(): Evento  { return this.evento; }

    public setConfirmado(confirmado:number): void { this.confirmado = confirmado; }
    public getConfirmado(): number | undefined { return this.confirmado; }

    public getDataCriacao(): Date | undefined { return this.dataCriacao; }
}

export default Presenca;