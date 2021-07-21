import { DataEditor, rendererPath } from "../DataEditor";
import * as path from "path";
import * as fs from 'fs';
import { ipcMain } from "electron";

export type FilesLoaderOptions = {
    dataEditor: DataEditor
}

export type DataStruct = [
    {
        name: string,
        "display-mode": string
    }
];

export type FilesLoaderInputs = {
    lang: string,
    filesList: InputDirectoryTargetFiles
};

export class FilesLoader {

    private dataEditor: DataEditor;

    private dataStruct: DataStruct;

    constructor(options: FilesLoaderOptions)
    {
        this.dataEditor = options.dataEditor;

        const dataStructFile = fs.readFileSync(path.join(__dirname, '../../', process.env.DATA_STRUCT_PATH as string)).toString();
        this.dataStruct = JSON.parse(dataStructFile) as DataStruct;

        this.setIcpMainListeners();
        this.displayInputSelection();
    }

    private setIcpMainListeners(): void
    {
        ipcMain.on('fileload-setInputs', (event, inputs: FilesLoaderInputs) => this.onSetInputs(event, inputs));
    }

    public displayInputSelection(): void
    {
        this.dataEditor.mainWindow.loadFile(path.join(rendererPath, "../render/loadFiles.html"));
    }

    public onSetInputs(event: Electron.IpcMainEvent, inputs: FilesLoaderInputs): void
    {
        if(typeof inputs !== 'object'
            || !inputs.lang 
            || !inputs.filesList)
        {
            event.reply('invalid inputs');
            console.warn('FilesLoader: invalid inputs');
            return;
        }

        this.dataEditor.lang = inputs.lang;
        this.parseDataStruct();
        
        console.log(inputs.filesList);

        event.reply('files loaded');
    }

    private parseDataStruct(): void
    {
        if(!this.dataEditor.lang)
        {
            throw Error("lang is not defined can't parse dataStruct");
        }

        for(const data of this.dataStruct)
        {
            data.name = data.name.replace('${lang}$', this.dataEditor.lang);
        }
    }
}