import { app, BrowserWindow } from "electron";
import * as path from "path";
import { DataEditor } from "./DataEditor";

// live reload
// eslint-disable-next-line @typescript-eslint/no-var-requires
/*require('electron-reload')(__dirname, {
    electron: require(path.join(__dirname, `../../node_modules/electron`))
});*/


function createWindow() 
{
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		width: 1900,
		height: 1000,
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	});

	// Open the DevTools.
	mainWindow.webContents.openDevTools();

	new DataEditor({
		mainWindow
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {
	createWindow();

	app.on("activate", () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
