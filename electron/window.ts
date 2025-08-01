import { BrowserWindow } from 'electron';
import path from 'path';

let win: BrowserWindow | null = null;

export function createMainWindow() {
  if (win) {
    win.show();
    win.focus();
    return win;
  }

  win = new BrowserWindow({
    width: 800,
    height: 600,
    resizable: false,
    minimizable: false,
    maximizable: false,
    show: false,
    frame: false,
    transparent: true,
    roundedCorners: true,
    vibrancy: process.platform === 'darwin' ? 'sidebar' : undefined,
    backgroundColor: '#00000000',
    icon: path.join(__dirname, '../assets/icon_rounded.png'),
    titleBarStyle: 'hidden',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  if(process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:5173');
  }else{
    win.loadFile(path.join(__dirname, '../index.html'));
  }

  win.once('ready-to-show', () => {
    win?.show();
  });

  win.on('close', (e) => {
    e.preventDefault();
    win?.hide();
  });

  return win;
}

export function getMainWindow() {
  return win;
}
