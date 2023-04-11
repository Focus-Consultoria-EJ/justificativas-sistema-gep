export interface IOEventoDTO
{
    id: number;
    titulo: string;
    descricao: string;
    dataCriacao?: Date;
    dataTermino?: Date;
}

class Evento 
{
    private id?: number;
    private titulo: string;
    private descricao: string;
    private dataCriacao?: Date;
    private dataTermino?: Date;

    constructor({ id, titulo, descricao, dataCriacao, dataTermino}: IOEventoDTO)
    {
        const dataAtual = new Date();
        const umDiaEmMs = 86400000; // um dia em Milissegundos

        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;     
        this.dataCriacao = dataCriacao ? new Date(dataCriacao) : new Date();

        // Caso a data não seja passada, define o dia de término como sendo o próximo dia
        this.dataTermino = dataTermino ? new Date(dataTermino) : new Date(dataAtual.getTime() + umDiaEmMs);
    }
    
    public getId(): number | undefined { return this.id; }

    public setTitulo(titulo: string): void { this.titulo = titulo; }
    public getTitulo(): string { return this.titulo; }

    public setDescricao(descricao: string): void { this.descricao = descricao; }
    public getDescricao(): string { return this.descricao; }

    public setDataTermino(dataTermino:Date): void { this.dataTermino = dataTermino; }
    public getDataTermino(): Date | undefined { return this.dataTermino; }

    public getDataCriacao(): Date | undefined { return this.dataCriacao; }
}

export default Evento;