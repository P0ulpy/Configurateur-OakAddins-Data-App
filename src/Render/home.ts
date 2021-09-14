window.addEventListener('DOMContentLoaded', () => 
{    
    const DOM = {
        table: document.getElementById('files-table') as HTMLTableElement
    };

    const electron = require('electron');
    const ipcRenderer = electron.ipcRenderer;

    const shared = electron.remote.getGlobal('shared');
    console.log(shared.dataFiles);

    showFilesTable(shared.dataFiles);

    function showFilesTable(dataFiles: any[] = [])
    {
        let header = 
        `<thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Display Mode</th>
                <th>Type</th>
                <th></th>
            </tr>
        </thead>`;

        let body = '<tbody>';

        for(const dataFile of dataFiles)
        {
            body += 
            `<tr>
                <td>${dataFile.name}</td>
                <td>${dataFile.description}</td>
                <td>${dataFile.displayMode}</td>
                <td>${dataFile.type}</td>
                <td><a class="btn btn-light" href="${__dirname}\\${'editor'/*dataFile.displayMode*/}.html?currentFile=${dataFile.displayMode}">Edit</a></td>
            </tr>`;
        }

        body += '</tbody>';

        DOM.table.innerHTML = header + body;
    }
});