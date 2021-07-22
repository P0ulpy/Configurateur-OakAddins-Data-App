import { app, BrowserWindow } from "electron";
import { EventEmitter } from "events";    
import { DataFile, FilesLoader } from "./FilesManagement/FilesLoader";
import * as path from "path";
import { Shared } from "./Shared";

export type DataEditorOptions = {
    mainWindow: BrowserWindow
}

export const rendererPath: string = path.join(__dirname, '../../render');
export const shared = new Shared();

export class DataEditor extends EventEmitter {

    public mainWindow: BrowserWindow;

    public filesLoader: FilesLoader;
    
    public lang: string | null = null;
    public dataFiles: DataFile[] | null = null;

    constructor(options: DataEditorOptions)
    {
        super();

        this.mainWindow = options.mainWindow;

        this.filesLoader = new FilesLoader({
            dataEditor: this
        });

        this.filesLoader.on('loaded', () => this.onFilesLoaded());
    }

    private onFilesLoaded(): void
    {
        if(!this.dataFiles)
        {
            throw Error("DataEditor: can't build editor dataFiles is not defined")
        }
        
        shared.set('dataFiles', this.dataFiles);
        this.mainWindow.loadFile(path.join(rendererPath, "./home.html"));

        /*for(const dataFile of this.dataFiles)
        {
            switch(dataFile.displayMode)
            {
                case 'string-list': 



                break;
                default:
                    console.error(`DataEditor: dataFile displayMode "${dataFile.displayMode}" is unknown`);
                    continue;
            }
        }*/
    }
}