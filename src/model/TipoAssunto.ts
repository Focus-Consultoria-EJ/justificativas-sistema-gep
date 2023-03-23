
export interface ITipoAssuntoDTO
{
    id?: number;
    nome?: string;
}

class TipoAssunto
{
    private id?: number;
    private nome?: string;

    constructor({id, nome}: ITipoAssuntoDTO)
    {
        this.id = id;
        this.nome = nome;
    }
    
    public getId(): number | undefined { return this.id; }

    public setNome(nome:string): void { this.nome = nome; }
    public getNome(): string | undefined { return this.nome; }
}

export default TipoAssunto;