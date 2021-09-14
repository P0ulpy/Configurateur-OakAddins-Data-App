const viewData = {};

window.addEventListener('DOMContentLoaded', () => 
{
    const params = getJsonFromUrl(location.search);
    
    const DOM = {
        container: document.querySelector('#editor-container') as HTMLElement
    };

    const electron = require('electron');
    const ipcRenderer = electron.ipcRenderer;

    const shared = electron.remote.getGlobal('shared');
    const dataFile = shared.dataFiles.find((file: any) => file.displayMode === params['currentFile']);
    const data = dataFile?.data as ListValue[];
    const struct = dataFile.struct as any[];

    console.log(data, struct, params);

    for(const element of struct)
    {
        switch(element.display)
        {
            // peut etre attrapé l'évenement depuis un autre fichier afin de pouvoir custom a fond ce qu'on fait

            case 'category': break;
            case 'input': break;
            case 'image-detail': break;
            case 'image': break;
            case 'link': break;
        }
    }
});