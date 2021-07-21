type InputDirectoryTargetFiles = {
    lastModified: number,
    lastModifiedDate: Date,
    name: string,
    path: string,
    size: number,
    type: string,
    webkitRelativePath: string
}

type InputDirectoryTarget = Event['target'] & {
    files: InputDirectoryTargetFiles[]
}

window.addEventListener('DOMContentLoaded', () => {
    
    const DOM = {
        form: document.getElementById('loadFiles-form'),
        file: document.getElementById('file-input') as HTMLDirectoryElement
    }

    console.log('aaaaa');

    DOM.form?.addEventListener('submit', (event) => 
    {
        event.preventDefault();
        event.stopPropagation();
    })

    DOM.file?.addEventListener('change', (event) => {
        
        const files = (event.target as InputDirectoryTarget).files;
        
        console.log(files);
    });

});