import { join } from 'path';
import {
    app,
    BrowserWindow,
    ipcMain,
    dialog,
} from 'electron';
import fs from 'fs'
import pathModule from 'path'

const isDev = process.env.npm_lifecycle_event === "app:dev" ? true : false;

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, '../preload/preload.js'),
            webSecurity: false,
        },
    });

    // and load the index.html of the app.
    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');// Open the DevTools.
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(join(__dirname, '../../index.html'));
    }
    // mainWindow.loadURL( //this doesn't work on macOS in build and preview mode
    //     isDev ?
    //     'http://localhost:3000' :
    //     join(__dirname, '../../index.html')
    // );
}

const formatSize = (size: number): string => {
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (
        +(size / Math.pow(1024, i)).toFixed() + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i]
    )
}

function getFiles(path: string) {
    // const path = process.cwd()
    const fileNames = fs.readdirSync(path)

    return fileNames
        .map(file => {
            const stats = fs.statSync(pathModule.join(path, file))
            return {
                name: file,
                size: stats.isFile() ? formatSize(stats.size ?? 0) : null,
                directory: stats.isDirectory(),
                path: pathModule.join(path, file),
            }
        })
        .sort((a, b) => {
            if(a.directory === b.directory) {
                return a.name.localeCompare(b.name)
            }
            return a.directory ? -1 : 1
        })
}

function saveFile(filePath: string, data: string) {
    try {
        fs.writeFileSync(filePath, data);
        console.log('File saved successfully.', filePath, data);
    } catch (err) {
        console.error(err);
    }
}

function formatDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = Math.floor(durationInSeconds % 60);
    const milliseconds = Math.floor((durationInSeconds % 1) * 1000);
  
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMilliseconds = milliseconds.toString().padStart(3, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}.${formattedMilliseconds}`;
}

function createFile(path: string, data: any) {
    console.log('creating file....')

    let content = 'WEBVTT'

    // TODO text cannot have new empty lines
    // TODO order array by start date before convert to string
    content += data.map((cue: any) => 
        `\n\n${cue.id}` +
        `\n${formatDuration(cue.startTime)} --> ${formatDuration(cue.endTime)}` +
        `\n${cue.text}` 
    ).join('')

    saveFile(path, content)
}
  

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    ipcMain.handle('ping', () => 'pong')
    ipcMain.handle('get-root-path', () => process.cwd())
    ipcMain.handle('get-back-path', (event, path) => pathModule.join(path,'../'))
    ipcMain.handle('get-files', (event, path) => getFiles(path))
    ipcMain.handle('create-file', (event, path, data) => createFile(path, data))

    ipcMain.handle('file-dialog', (event, params) => {     
       return dialog.showOpenDialogSync(params);
    });

    ipcMain.handle('file-save-dialog', (event, params) => {     
       return dialog.showSaveDialogSync(params);
    });

    createWindow()
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
