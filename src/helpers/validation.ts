const valueExists = (value: any, msg: string): void => 
{
    if(!value) throw msg;
    if(Array.isArray(value) && value.length === 0) throw msg;
    if(typeof value === "string" && !value.trim()) throw msg;
}

export  { valueExists }

    
