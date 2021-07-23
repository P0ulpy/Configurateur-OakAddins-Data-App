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
                <th scope="col">name</th>
                <th scope="col">Display Mode</th>
                <th scope="col">type</th>
                <th scope="col"></th>
            </tr>
        </thead>`;

        let body = '<tbody>';

        for(const dataFile of dataFiles)
        {
            body += 
            `<tr>
                <td>${dataFile.name}</td>
                <td>${dataFile.displayMode}</td>
                <td>${dataFile.type}</td>   
                <td><a class="btn btn-light" href="${__dirname}/${dataFile.displayMode}.html">Edit</a></td>
            </tr>`;
        }

        body += '</tbody>';

        DOM.table.innerHTML = header + body;
    }
});