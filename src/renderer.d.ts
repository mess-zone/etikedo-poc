export type FileInfo = {
  name: string,
  size: string,
  directory: string,
  path: string,
}

export interface IElectronAPI {
    node: () => Promise<string>,
    chrome: () => Promise<string>,
    electron: () => Promise<string>,
    ping: () => Promise<string>,
    getRootPath: () => Promise<string>,
    getBackPath: (path: string) => Promise<string>,
    getFiles: (path: string) => Promise<FileInfo[]>,
    createFile: (path: string, data: any) => Promise<void>,
    createSubtitleFile: (path: string, data: any) => Promise<void>,
    openFileDialog: (config: any) => Promise<string[]>,
    openSaveDialog: (config: any) => Promise<string>,
}

declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }