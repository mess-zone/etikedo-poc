export type FileInfo = {
  name: string,
  size: string,
  directory: string,
}

export interface IElectronAPI {
    node: () => Promise<string>,
    chrome: () => Promise<string>,
    electron: () => Promise<string>,
    ping: () => Promise<string>,
    getRootPath: () => Promise<string>,
    getFiles: (path: string) => Promise<FileInfo[]>,
}

declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }