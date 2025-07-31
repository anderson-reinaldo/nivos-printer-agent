import { app } from 'electron';
import { createAppTray } from './tray';
import { getMainWindow } from './window';
import { startServer } from './server';
import { ipcMain } from 'electron';

app.whenReady().then(() => {
  createAppTray();
  startServer();
  // Garante que o app aparece na dock/taskbar em todas as plataformas
  if (process.platform === 'darwin') {
    app.dock.show();
  } else if (process.platform === 'win32' || process.platform === 'linux') {
    const win = getMainWindow();
    if (win) win.setSkipTaskbar(false);
    app.focus({ steal: true });
  }
});

app.setLoginItemSettings({
  openAtLogin: true,
});

app.on('window-all-closed', (_e?: unknown) => {
  // Não fecha o app ao fechar a janela, só fecha se sair pelo tray
});

ipcMain.on('window:minimize', () => {
  const window = getMainWindow();
  if (window) window.minimize();
});

ipcMain.on('window:close', () => {
  const window = getMainWindow();
  if (window) window.hide(); // ou `window.close()` se quiser encerrar de fato
});