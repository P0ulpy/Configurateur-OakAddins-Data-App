import { BrowserWindow } from "electron";
import { FilesLoader } from "./FilesManagement/FilesLoader";
import * as path from "path";

export type DataEditorOptions = {
    mainWindow: BrowserWindow
}

export const rendererPath: string = path.join(__dirname);

export class DataEditor {

    public mainWindow: BrowserWindow;

    public filesLoader: FilesLoader;
    public lang: string | null = null;

    constructor(options: DataEditorOptions)
    {
        this.mainWindow = options.mainWindow;

        this.filesLoader = new FilesLoader({
            dataEditor: this
        });
    }
}