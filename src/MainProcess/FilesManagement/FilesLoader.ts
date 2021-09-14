import { DataEditor, rendererPath } from "../DataEditor";
import * as path from "path";
import * as fs from 'fs';
import { ipcMain } from "electron";
import { EventEmitter } from "events";    

export type FilesLoaderOptions = {
    dataEditor: DataEditor
}

export interface DataFile {
    name: string,
    type: 'js' | 'json',
    displayMode: string,
    description: string,
    data: any,
    struct: any
}

export interface DataFileRaw {
    name: string,
    type: 'js' | 'json',
    data: any,
    struct: any
}

export interface DataStruct {
    name: string,
    description: string,
    displayMode: string,
    struct: string
};

export interface FilesLoaderInputs {
    lang: string,
    filesList: InputDirectoryTargetFile[]
}

export class FilesLoader extends EventEmitter {

    private dataEditor: DataEditor;

    public dataStruct: DataStruct[];

    constructor(options: FilesLoaderOptions)
    {
        super();

        this.dataEditor = options.dataEditor;

        const dataStructFile = fs.readFileSync(path.join(__dirname, '../../../', process.env.DATA_STRUCT_PATH as string)).toString();
        this.dataStruct = JSON.parse(dataStructFile) as DataStruct[];

        this.setIcpMainListeners();
        this.displayInputSelection();
    }

    private setIcpMainListeners(): void
    {
        ipcMain.on('fileload-setInputs', (event, inputsRaw: string) => this.onSetInputs(event, inputsRaw));        
    }

    public displayInputSelection(): void
    {
        this.dataEditor.mainWindow.loadFile(path.join(rendererPath, "./loadFiles.html"));
    }

    public onSetInputs(event: Electron.IpcMainEvent, inputsRaw: string): void
    {
        const inputs = JSON.parse(inputsRaw) as FilesLoaderInputs;

        console.log('FilesLoader: recieving inputs');

        if(typeof inputs !== 'object'
            || !inputs.lang 
            || !inputs.filesList)
        {
            event.reply('invalid inputs');
            console.error('FilesLoader: invalid inputs');
            return;
        }

        this.dataEditor.lang = inputs.lang;

        this.dataStruct = this.parseDataStruct();
        this.dataEditor.dataFiles = this.parseFiles(inputs.filesList);
        
        console.log('FilesLoader: files loaded');
        event.reply('files loaded');

        this.emit('loaded');
    }
    
    private parseDataStruct(): DataStruct[]
    {
        if(!this.dataEditor.lang || typeof this.dataEditor.lang !== 'string')
        {
            throw Error("lang is not defined can't parse dataStruct");
        }

        const dataStruct = [] as DataStruct[];

        for(const data of this.dataStruct)
        {
            dataStruct.push({
                name: data.name.replace('${lang}$', this.dataEditor.lang),
                description: data.description,
                displayMode: data.displayMode,
                struct: data.struct
            });
        }
        
        this.emit('dataStruct-parsed', dataStruct);
        return dataStruct;
    }

    private loadFiles(files: InputDirectoryTargetFile[]): DataFileRaw[]
    {
        const dataFiles = [] as DataFileRaw[];

        for(const file of files)
        {
            const dataFileBuffer = fs.readFileSync(file.path);

            const dataFile = {
                name: file.name
            } as DataFileRaw;

            switch(file.type)
            {
                case 'application/json': 

                    dataFile.type = 'json';
                    dataFile.data = JSON.parse(dataFileBuffer.toString());

                    break;
                
                case 'text/javascript': 
                
                    dataFile.type = 'js';
                    dataFile.data = dataFileBuffer.toString();

                    break;
                
                default: 
                    console.error('FilesLoader: invalid file type');
                    continue;
            }

            dataFiles.push(dataFile);
        }

        console.log('FilesLoader: files loaded');
        return dataFiles;
    }

    private parseFiles(files: InputDirectoryTargetFile[]): DataFile[]
    {
        const dataFilesRaw = this.loadFiles(files);
        const dataFiles = [] as DataFile[];

        for(const datafileRaw of dataFilesRaw)
        {
            for(const dataStruct of this.dataStruct)
            {
                if(dataStruct.name === datafileRaw.name)
                {
                    console.log('FilesLoader: parsing', dataStruct.name);

                    dataFiles.push({
                        displayMode: dataStruct.displayMode,
                        name: dataStruct.name,
                        description: dataStruct.description,
                        type: datafileRaw.type,
                        data: datafileRaw.data,
                        struct: JSON.parse(fs.readFileSync(path.join(__dirname, '../../../', process.env.DATA_PATH as string, dataStruct.struct)).toString())
                    });
                }
            }
        }

        console.log('FilesLoader: files parsed');

        return dataFiles;
    }
}