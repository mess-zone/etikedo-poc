export interface IElectronAPI {
    node: () => Promise<string>,
    chrome: () => Promise<string>,
    electron: () => Promise<string>,
    ping: () => Promise<string>,
}

declare global {
    interface Window {
      electronAPI: IElectronAPI
    }
  }