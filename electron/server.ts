import express, { Request, Response } from 'express';
import { SerialPort, SerialPortOpenOptions } from 'serialport';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import Store from 'electron-store';
import fs from 'fs';
import os from 'os';

interface Config {
  port: string | null;
}

interface PrintPayload {
  text: string[];
}

// Configuração do electron-store
const store = new Store<Config>({
  defaults: {
    port: null
  },
  schema: {
    port: {
      type: ['string', 'null'],
      default: null
    }
  }
});

const app = express();
app.use(express.json());
app.use(cors());

// Função de impressão comum (usada por HTTP e WebSocket)
async function handlePrint(text: string[]): Promise<{ status: boolean; message: string }> {
  if (!Array.isArray(text)) {
    return { status: false, message: 'Payload inválido. Esperado: { text: [string, ...] }' };
  }

  const ports = await SerialPort.list();
  const currentPort = store.get('port');
  const selectedPort = currentPort ? ports.find(p => p.path === currentPort) : ports[0];

  if (!selectedPort) {
    return { status: false, message: 'Nenhuma porta serial disponível.' };
  }

  const cleanText = text.map(line => line.replace(/[^\x20-\x7E]/g, '')).join('\n');

  const options: SerialPortOpenOptions<any> = {
    path: selectedPort.path,
    baudRate: 9600,
    lock: false,
    autoOpen: false
  };

  const printer = new SerialPort(options);

  return new Promise((resolve) => {
    printer.open(err => {
      if (err) {
        return resolve({ status: false, message: 'Erro ao abrir porta: ' + err.message });
      }

      printer.write(cleanText + '\n\n', 'utf8', err => {
        if (err) {
          printer.close();
          return resolve({ status: false, message: 'Erro na impressão: ' + err.message });
        }

        setTimeout(() => {
          printer.close();
        }, 500);

        return resolve({ status: true, message: 'Impressão enviada com sucesso.' });
      });
    });
  });
}

// Rota HTTP para impressão
app.post('/print', async (req: Request, res: Response) => {
  const { text } = req.body as PrintPayload;
  const result = await handlePrint(text);
  res.status(result.status ? 200 : 400).json(result);
});

// Listar portas seriais disponíveis
app.get('/ports', async (_req: Request, res: Response) => {
  try {
    const ports = await SerialPort.list();
    const portList = ports.map(port => ({
      path: port.path,
      manufacturer: port.manufacturer || '',
      serialNumber: port.serialNumber || '',
      friendlyName: `${port.path}${port.manufacturer ? ' - ' + port.manufacturer : ''}`
    }));
    res.json({ status: true, ports: portList });
  } catch (error: any) {
    res.status(500).json({ status: false, message: 'Erro ao listar portas: ' + error.message });
  }
});

// Selecionar e salvar a porta
app.post('/select-port', (req: Request, res: Response) => {
  const { port } = req.body;

  if (!port || typeof port !== 'string') {
    return res.status(400).json({ status: false, message: 'Porta inválida.' });
  }

  store.set('port', port);
  res.json({ status: true, message: `Porta ${port} salva com sucesso.` });
});

// WebSocket para impressão
const wss = new WebSocketServer({ port: 4101 });

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (data: any) => {
    try {
      const { text } = JSON.parse(data.toString()) as PrintPayload;
      const result = await handlePrint(text);
      ws.send(JSON.stringify(result));
    } catch (error: any) {
      ws.send(JSON.stringify({ status: false, message: error.message }));
    }
  });
});

// Inicia o servidor
export function startServer() {
  const PORT = 4100;

  // Garante que a pasta ~/.printer-agent existe (opcional)
  fs.mkdirSync(os.homedir() + '/.printer-agent', { recursive: true });

  app.listen(PORT, () => {
    console.log(`Servidor de impressão ativo em http://localhost:${PORT}`);
  });
}
