import { app, BrowserWindow, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import { startServer } from '../../rtech-printer-agent/src/server';

let tray: Tray | null = null;
let win: BrowserWindow | null = null;

function createWindow() {
  if (win) {
    win.show();
    win.focus();
    return;
  }
  win = new BrowserWindow({
    width: 400,
    height: 320,
    resizable: false,
    minimizable: false,
    maximizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  // Carregar React build (ajustar caminho conforme build tool)
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173'); // Exemplo: Vite dev server
  } else {
    win.loadFile(path.join(__dirname, '../dist/renderer/index.html'));
  }
  win.on('close', (e) => {
    e.preventDefault();
    win?.hide();
  });
}

function createTray() {
  let iconPath = path.join(__dirname, '../assets/printer-tray.png');
  let trayIcon: Electron.NativeImage | string = iconPath;
  try {
    const img = nativeImage.createFromPath(iconPath);
    if (!img.isEmpty()) trayIcon = img;
  } catch {
    trayIcon = iconPath;
  }
  tray = new Tray(trayIcon as any);
  tray.setToolTip('Agente de Impressão Local');
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Abrir Painel',
      click: () => {
        createWindow();
        win?.show();
      }
    },
    { type: 'separator' },
    {
      label: 'Sair',
      click: () => {
        app.quit();
      }
    }
  ]));
  tray.on('double-click', () => {
    createWindow();
    win?.show();
  });
}

app.whenReady().then(() => {
  createTray();
  startServer();
});

app.setLoginItemSettings({
  openAtLogin: true,
});

app.on('window-all-closed', (_e?: unknown) => {
  // Não fecha o app ao fechar a janela, só fecha se sair pelo tray
});
