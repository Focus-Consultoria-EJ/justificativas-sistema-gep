
export interface ISharkDTO
{
    id?: number;
    nome: string;
    email: string;
    telefone: string;
    matricula: string;
    senha: string;
    area: string;
    numProjeto?: number;
    metragem?: number;
    admin?: number;
    membroAtivo?: number;
    dataCriacao?: Date;
}

class Shark 
{
    private id?: number;
    private nome: string;
    private email: string;
    private telefone: string;
    private matricula: string;
    private senha: string;
    private area: string;
    private numProjeto?: number;
    private metragem?: number;
    private admin?: number;
    private membroAtivo?: number;
    private dataCriacao?: Date;

    constructor({id, nome, email, telefone, matricula, senha, area, numProjeto, metragem, admin, membroAtivo, dataCriacao}: ISharkDTO)
    {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;     
        this.matricula = matricula;     
        this.senha = senha;     
        this.area = area;    
        this.numProjeto = numProjeto; 
        this.metragem = metragem;     
        this.admin = admin;     
        this.membroAtivo = membroAtivo;     
        this.dataCriacao = dataCriacao ? new Date(dataCriacao) : new Date();     
    }
    
    public getId(): number | undefined { return this.id; }

    public setNome(nome:string): void { this.nome = nome; }
    public getNome(): string { return this.nome; }

    public setEmail(email:string): void { this.email = email; }
    public getEmail(): string { return this.email; }

    public setTelefone(telefone:string): void { this.telefone = telefone; }
    public getTelefone(): string { return this.telefone; }
    
    public setMatricula(matricula:string): void { this.matricula = matricula; }
    public getMatricula(): string { return this.matricula; }

    public setSenha(senha:string): void { this.senha = senha; }
    public getSenha(): string { return this.senha; }

    public setArea(area:string): void { this.area = area; }
    public getArea(): string { return this.area; }

    public setNumProjeto(numProjeto:number): void { this.numProjeto = numProjeto; }
    public getNumProjeto(): number | undefined  { return this.numProjeto; }

    public getMetragem(): number | undefined { return this.metragem; }

    public setAdmin(admin:number): void { this.admin = admin; }
    public getAdmin(): number | undefined { return this.admin; }

    public setMembroAtivo(membroAtivo:number): void { this.membroAtivo = membroAtivo; }
    public getMembroAtivo(): number | undefined { return this.membroAtivo; }

    public getDataCriacao(): Date | undefined { return this.dataCriacao; }
}

export default Shark;