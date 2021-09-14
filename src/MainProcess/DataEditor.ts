import { app, BrowserWindow } from "electron";
import { EventEmitter } from "events";    
import { DataFile, FilesLoader } from "./FilesManagement/FilesLoader";
import * as path from "path";
import { Shared } from "./Shared";
import { DataViewer } from "./DataManagement/DataViewer";
import { StringListViewer } from "./DataManagement/Viewers/StringListViewer";
import { ObjectConfigViewer } from "./DataManagement/Viewers/ObjectConfigViewer";

export type DataEditorOptions = {
    mainWindow: BrowserWindow
};

export const rendererPath: string = path.join(__dirname, '../../render');
export const shared = new Shared();

export class DataEditor extends EventEmitter {

    public static singleton: DataEditor | null = null;

    public mainWindow: BrowserWindow;

    private filesLoader: FilesLoader;
    private fileViewers: Map<string, DataViewer> = new Map<string, DataViewer>();
    
    public lang: string | null = null;
    public dataFiles: DataFile[] | null = null;

    constructor(options: DataEditorOptions)
    {
        super();
        
        if(DataEditor.singleton)
        {
            throw Error('DataEditor is a singleton class you cant reinstanciate it');
        }

        DataEditor.singleton = this;

        this.mainWindow = options.mainWindow;

        this.filesLoader = new FilesLoader({
            dataEditor: this
        });

        this.filesLoader.on('dataStruct-parsed', () => this.onDataStructParsed());
        this.filesLoader.on('loaded', () => this.onFilesLoaded());
    }

    private onDataStructParsed(): void
    {
        for(const dataStruct of this.filesLoader.dataStruct)
        {
            switch(dataStruct.displayMode)
            {
                /* Deprecated
                case 'string-list': 
                    this.fileViewers.set(dataStruct.displayMode, new StringListViewer())
                break;
                */

                case 'global-config':
                    this.fileViewers.set(dataStruct.displayMode, new ObjectConfigViewer())
                break;

                default: 
                    console.error('unknown displayMode', dataStruct.displayMode);
            }

        }
    }

    private onFilesLoaded(): void
    {
        if(!this.dataFiles)
        {
            throw Error("DataEditor: can't build editor dataFiles is not defined")
        }
        
        shared.set('dataFiles', this.dataFiles);
        this.mainWindow.loadFile(path.join(rendererPath, "./home.html"));
    }
}