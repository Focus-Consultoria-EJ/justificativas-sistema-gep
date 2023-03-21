
export interface ISharkDTO
{
    id: number;
    nome: string;
    email: string;
    telefone: string;
    matricula: string;
    senha: string;
    area: string;
    metragem: number;
    admin: number;
    membro_ativo: number;
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
    private metragem?: number;
    private admin?: number;
    private membro_ativo?: number;

    constructor({id, nome, email, telefone, matricula, senha, area, metragem, admin, membro_ativo}: ISharkDTO)
    {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;     
        this.matricula = matricula;     
        this.senha = senha;     
        this.area = area;     
        this.metragem = metragem;     
        this.admin = admin;     
        this.membro_ativo = membro_ativo;     
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

    public getMetragem(): number | undefined { return this.metragem; }

    public setAdmin(admin:number): void { this.admin = admin; }
    public getAdmin(): number | undefined { return this.admin; }

    public setMembroAtivo(membro_ativo:number): void { this.membro_ativo = membro_ativo; }
    public getMembroAtivo(): number | undefined { return this.membro_ativo; }
}

export default Shark;