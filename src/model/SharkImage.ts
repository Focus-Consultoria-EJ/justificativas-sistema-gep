import Shark from "./Shark";

export interface ISharkImageDTO
{
    id: number;
    filename: string;
    size: number;
    hashname: string;
    url: string;
    shark: Shark;
}

class SharkImage 
{
    private id?: number;
    private filename: string;
    private size: number;
    private hashname: string;
    private url: string;
    private shark: Shark;

    constructor({id, filename, size, hashname, url, shark}: ISharkImageDTO)
    {
        this.id = id;
        this.filename = filename;
        this.size = size;
        this.hashname = hashname;     
        this.url = url;     
        this.shark = shark;     
    }
    
    public getId(): number | undefined { return this.id; }

    public setFilename(filename:string): void { this.filename = filename; }
    public getFilename(): string  { return this.filename; }

    public setSize(size:number): void { this.size = size; }
    public getSize(): number  { return this.size; }

    public setHashname(hashname:string): void { this.hashname = hashname; }
    public getHashname(): string  { return this.hashname; }

    public setUrl(url:string): void { this.url = url; }
    public getUrl(): string { return this.url; }

    public setShark(shark:Shark): void { this.shark = shark; }
    public getShark(): Shark  { return this.shark; }
}

export default SharkImage;