type InputDirectoryTarget = Event['target'] & {
    files: InputDirectoryTargetFile[]
}

interface InputDirectoryTargetFile {
    lastModified: number,
    lastModifiedDate: Date,
    name: string,
    path: string,
    size: number,
    type: string,
    webkitRelativePath: string
}

interface FilesLoaderInputs {
    lang: string,
    filesList: InputDirectoryTargetFile[]
}


window.addEventListener('DOMContentLoaded', () => 
{    
    // requires (for avoid redeclaration block-scoped variable TypeScript error)
    const electron = require('electron');
    const ipcRenderer = electron.ipcRenderer;

    const DOM = {
        form: document.getElementById('loadFiles-form') as HTMLFormElement,
        file: document.getElementById('file-input') as HTMLDirectoryElement,
        lang: document.getElementById('lang-input') as HTMLInputElement
    };

    const formData = {} as FilesLoaderInputs;

    DOM.file?.addEventListener('change', (event) => 
    {
        formData.filesList = (event.target as InputDirectoryTarget).files;
    });

    DOM.form?.addEventListener('submit', (event) => 
    {
        event.preventDefault();
        event.stopPropagation();

        if(DOM.form.checkValidity() && formData.filesList)
        {
            formData.lang = DOM.lang.value;
            
            console.log('fileload-setInputs', formData);

            ipcRenderer.send('fileload-setInputs', parseInputs(formData));
        }
    });

    function parseInputs(formData: FilesLoaderInputs): string
    {
        const parsedData = {
            lang: formData.lang,
            filesList: [] as InputDirectoryTargetFile[]
        };

        for(const data of formData.filesList)
        {
            parsedData.filesList.push({
                lastModified: data.lastModified,
                name: data.name,
                path: data.path,
                size: data.size,
                type: data.type,
                webkitRelativePath: data.webkitRelativePath
            } as InputDirectoryTargetFile);
        }
        
        return JSON.stringify(parsedData);
    }
});