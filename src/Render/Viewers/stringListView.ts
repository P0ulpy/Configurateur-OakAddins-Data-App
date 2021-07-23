interface ListInput {
    input: HTMLInputElement,
    data: any,
    type: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function"
}

interface StringInArrayInput extends ListInput {
    index: number,
    array: ListValue[]
}

type ListValue = string | string[]

window.addEventListener('DOMContentLoaded', () => {

    const DOM = {
        container: document.querySelector('.container') as HTMLElement
    };

    const electron = require('electron');
    const ipcRenderer = electron.ipcRenderer;

    const shared = electron.remote.getGlobal('shared');
    const data = shared.dataFiles.find((file: any) => file.displayMode === 'string-list').data as ListValue[];

    const inputs: ListInput[] = [];
    buildInputs();

    `
    <div class="list-group">
        <a href="#" class="list-group-item list-group-item-action active" aria-current="true">
            The current link item
        </a>
        <a href="#" class="list-group-item list-group-item-action">A second link item</a>
        <a href="#" class="list-group-item list-group-item-action">A third link item</a>
        <a href="#" class="list-group-item list-group-item-action">A fourth link item</a>
        <a href="#" class="list-group-item list-group-item-action disabled" tabindex="-1" aria-disabled="true">A disabled link item</a>
    </div>
    `

    function buildInputs()
    {
        const list = document.createElement('div');
        list.classList.add('list-group');

        console.log(data);

        for(let i = 0; i < data.length; i++)
        {
            switch(typeof data[i])
            {
                case 'string': 
        
                    const stringInput = document.createElement('input');
                    stringInput.setAttribute('type', 'text');
                    stringInput.classList.add('list-group-item', 'list-group-item-action');
                    stringInput.value = data[i] as string;

                    inputs.push({
                        type: typeof data[i],
                        data: data[i],
                        input: stringInput,
                        array: data,
                        index: i
                    } as StringInArrayInput);

                    list.appendChild(stringInput);

                break;

                case 'object': 

                    if(!Array.isArray(data[i])) break;

                    `<div class="accordion" id="accordionPanelsStayOpenExample">`
                    const listContainer = document.createElement('div');
                    listContainer.classList.add('accordion');
                    listContainer.id = `array-${i}`;

                    buildArrayInner(data[i] as string[], listContainer, );

                break;
            }
        }

        DOM.container.innerHTML = "";
        DOM.container.appendChild(list);
    }


    function buildArrayInner(array: string[], listContainer: HTMLElement)
    {
        for(let i = 0; i < array.length; i++)
        {
            const parentID = listContainer.id;
            const headerID = `${listContainer.id}-string-h${i}`;
            const bodyID = `${listContainer.id}-string-b${i}`;

            const itemContainer = document.createElement('div');
            itemContainer.classList.add('accordion-item');
    
            const itemHeader = `
            <h2 class="accordion-header" id="panelsStayOpen-headingTwo${headerID}">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${parentID}" aria-expanded="false" aria-controls="${parentID}">
                    ${array[i]}
                </button>
            </h2>
            `;
            itemContainer.innerHTML += itemHeader;
    
            const itemBody = document.createElement('div');
            itemBody.classList.add('accordion-body');
            itemBody.id = `${itemContainer.id}-string-b${i}`;




            listContainer.appendChild(itemContainer);
        }
    }














});