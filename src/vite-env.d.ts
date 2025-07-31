/// <reference types="vite/client" />

interface ElectronAPI {
  minimizeWindow?: () => void;
  closeWindow?: () => void;
}

declare interface Window {
  electronAPI?: ElectronAPI;
}
