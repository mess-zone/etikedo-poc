// // All of the Node.js APIs are available in the preload process.
// // It has the same sandbox as a Chrome extension.
// window.addEventListener('DOMContentLoaded', () => {
//     const replaceText = (selector:any, text:any) => {
//       const element = document.getElementById(selector)
//       if (element) element.innerText = text
//     }

//     for (const dependency of ['chrome', 'node', 'electron']) {
//       replaceText(`${dependency}-version`, process.versions[dependency])
//     }
//   })

const { contextBridge, ipcRenderer  } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
  getRootPath: () => ipcRenderer.invoke('get-root-path'),
  getBackPath: (path: string) => ipcRenderer.invoke('get-back-path', path),
  getFiles: (path: string) => ipcRenderer.invoke('get-files', path),
  
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  createFile: (path: string, data: any) => ipcRenderer.invoke('create-file', path, data),
  createSubtitleFile: (path: string, data: any) => ipcRenderer.invoke('create-subtitle-file', path, data),
  openFileDialog: (config: any) => ipcRenderer.invoke('file-dialog', config),
  openSaveDialog: (config: any) => ipcRenderer.invoke('file-save-dialog', config),
})
