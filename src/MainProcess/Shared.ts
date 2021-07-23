export type GlobalEdited = typeof global & {
    shared: {
        [index: string] : any
    }
}

export class Shared 
{
    constructor()
    {
        (global as GlobalEdited).shared = {};
    }

    public set(index: string, value: any): void
    {
        (global as GlobalEdited).shared[index] = value;
    }

    public get(index: string): any
    {
        return (global as GlobalEdited).shared[index]; 
    }
}