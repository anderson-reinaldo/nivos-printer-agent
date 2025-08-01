import { Tray, Menu, nativeImage, app } from 'electron';
import path from 'path';
import { createMainWindow } from './window';

let tray: Tray | null = null;

export function createAppTray() {
  if (tray) return tray; // evita recriar o tray

  const iconPath = path.join(__dirname, '../assets/icon_no_bg.png');
  let trayIcon: Electron.NativeImage;

  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    if (trayIcon.isEmpty()) {
      throw new Error('Imagem vazia');
    }

    // Ícones em tray normalmente ficam melhores com tamanhos otimizados
    trayIcon = trayIcon.resize({ width: 16, height: 16 });
  } catch (error) {
    console.warn('Erro ao carregar ícone do tray, usando fallback:', error);
    trayIcon = nativeImage.createEmpty();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('🖨️ Agente de Impressão Local');

  const showWindow = () => {
    const win = createMainWindow();
    win.show();
    win.focus();
  };

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🖨️ Abrir Painel de Impressão',
      click: showWindow,
    },
    { type: 'separator' },
    {
      label: '⏻ Sair',
      click: () => {
        tray?.destroy();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Abre com clique simples no ícone (não só duplo)
  tray.on('click', showWindow);
  tray.on('double-click', showWindow);

  return tray;
}
