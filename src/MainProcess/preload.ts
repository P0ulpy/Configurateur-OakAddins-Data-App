import { rendererPath } from "./DataEditor";
import { DataFile } from "./FilesManagement/FilesLoader";

// It has the same sandbox as a Chrome extension.
window.addEventListener("DOMContentLoaded", () => {

    const electron = require('electron');
    const shared = electron.remote.getGlobal('shared');
    
    const navContainer = document.createElement('nav');
    navContainer.classList.add('navbar', 'navbar-expand-lg', 'navbar-light', 'bg-light');

    let navbar = `<div class="container-fluid">`;
    navbar += `<a class="navbar-brand" href="home.html">DataEditor</a>`;

    navbar += `
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>`

    if(shared.dataFiles)
    {
        navbar += `<div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">`;

        // Home
        navbar += 
        `<li class="nav-item">
            <a class="nav-link" aria-current="page" href="${rendererPath}/home.html">Home</a>
        </li>`;

        // ReloadData
        navbar += 
        `<li class="nav-item">
            <a class="nav-link" aria-current="page" href="${rendererPath}/loadFiles.html">Reload Data</a>
        </li>`;


        // EditFile
        let dropDown = `
        <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                EditFile
            </a>
            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">`;

        for(const file of shared.dataFiles as DataFile[])
        {
            dropDown += `<li><a class="dropdown-item" href="${rendererPath}\\${file.displayMode}.html?currentFile=${file.displayMode}">${file.name}</a></li>`
        }

        dropDown += '</ul></li>';
        navbar += dropDown;
    }
    else
    {
        navbar += `<a type="button" class="btn btn-danger" href="${rendererPath}/loadFiles.html">No data loaded <i class="bi bi-exclamation-triangle"></i></a>`
    }

    navbar += `</ul></div></div>`;

    navContainer.innerHTML = navbar;

    const backArrow = document.createElement('button');
    backArrow.classList.add('btn', 'btn-secondary', 'mx-2', 'my-2');
    backArrow.innerHTML = `<i class="bi bi-arrow-left"></i> Back`;
    backArrow.addEventListener('click', () => history.back());

    document.body.prepend(backArrow);
    document.body.prepend(navContainer);
});
