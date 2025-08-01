import { app, ipcMain } from 'electron';
import { createAppTray } from './tray';
import { getMainWindow } from './window';
import { startServer } from './server';
import fs from 'fs';
import path from 'path';
import os from 'os';

app.setPath('userData', path.join(os.homedir(), '.printer-agent'));

function ensureAutoStartOnLinuxOnce() {
  if (process.platform !== 'linux') return;

  const userData = app.getPath('userData');
  const flagPath = path.join(userData, 'autostart-flag');

  if (fs.existsSync(flagPath)) {
    return;
  }

  const autostartDir = path.join(os.homedir(), '.config', 'autostart');
  const desktopEntryPath = path.join(autostartDir, 'printer-agent.desktop');
  const execPath = app.getPath('exe');

  const desktopEntry = `
    [Desktop Entry]
    Type=Application
    Exec=${execPath}
    Hidden=false
    NoDisplay=false
    X-GNOME-Autostart-enabled=true
    Name=Printer Agent
    Comment=Inicia o Printer Agent automaticamente
  `;

  fs.mkdirSync(autostartDir, { recursive: true });
  fs.writeFileSync(desktopEntryPath, desktopEntry.trim());

  // Marca que já foi criado
  fs.writeFileSync(flagPath, 'done');
}

app.whenReady().then(() => {
  createAppTray();
  startServer();

  if (process.platform === 'darwin') {
    app.dock.show();
  } else if (process.platform === 'win32' || process.platform === 'linux') {
    const win = getMainWindow();
    if (win) win.setSkipTaskbar(false);
    app.focus({ steal: true });
  }

  // Aplica auto-start no login (recomendado para Windows/macOS/Linux)
  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe'),
  });

  // Garante autostart no Linux apenas na primeira execução
  ensureAutoStartOnLinuxOnce();
});

app.on('window-all-closed', (_e?: unknown) => {
  // Mantém rodando em background
});

ipcMain.on('window:minimize', () => {
  const window = getMainWindow();
  if (window) window.minimize();
});

ipcMain.on('window:close', () => {
  const window = getMainWindow();
  if (window) window.hide();
});
