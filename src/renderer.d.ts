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
}

declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }