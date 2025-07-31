import express, { Request, Response } from 'express';
import { SerialPort, SerialPortOpenOptions } from 'serialport';
import fs from 'fs';
import path from 'path';
import { WebSocketServer, WebSocket } from 'ws';

interface Config {
  port: string | null;
}

const configPath = path.resolve(__dirname, '../config.json');
const config: Config = fs.existsSync(configPath)
  ? JSON.parse(fs.readFileSync(configPath, 'utf8'))
  : { port: null };

const app = express();
app.use(express.json());

app.post('/print', async (req: Request, res: Response) => {
  const { text } = req.body;

  if (!Array.isArray(text)) {
    return res.status(400).json({ status: false, message: 'Payload inválido. Esperado: { text: [string, ...] }' });
  }

  const ports = await SerialPort.list();
  let selectedPort = ports.find(p => p.path === config.port) || ports[0];

  if (!selectedPort) {
    return res.status(404).json({ status: false, message: 'Nenhuma porta serial disponível.' });
  }

  // Limpa o texto para caracteres imprimíveis na impressora térmica
  const cleanText = text.map((line: string) => line.replace(/[^\x20-\x7E]/g, '')).join('\n');

  // Corrigido: não usar tipo genérico em SerialPortOpenOptions
  const options: SerialPortOpenOptions<any> = {
    path: selectedPort.path,
    baudRate: 9600,
    lock: false,
    autoOpen: false
  };

  const printer = new SerialPort(options);

  printer.open(err => {
    if (err) {
      return res.json({ status: false, message: 'Erro ao abrir porta: ' + err.message });
    }

    printer.write(cleanText + '\n\n', 'utf8', err => {
      if (err) {
        printer.close();
        return res.json({ status: false, message: 'Erro na impressão: ' + err.message });
      } else {
        // Aguarda um pouco antes de fechar a porta
        setTimeout(() => {
          printer.close();
        }, 500);
        return res.json({ status: true, message: 'Impressão enviada com sucesso.' });
      }
    });
  });
});

// Endpoint para listar portas seriais disponíveis
app.get('/ports', async (_req: Request, res: Response) => {
  try {
    const ports = await SerialPort.list();
    const portList = ports.map(port => ({
      path: port.path,
      manufacturer: port.manufacturer || '',
      serialNumber: port.serialNumber || '',
      friendlyName: `${port.path} ${port.manufacturer ? '- ' + port.manufacturer : ''}`.trim()
    }));
    res.json({ status: true, ports: portList });
  } catch (err: any) {
    res.status(500).json({ status: false, message: 'Erro ao listar portas: ' + err.message });
  }
});

// Endpoint para selecionar/salvar a porta serial
app.post('/select-port', (req: Request, res: Response) => {
  const { port } = req.body;
  if (!port || typeof port !== 'string') {
    return res.status(400).json({ status: false, message: 'Porta inválida.' });
  }
  config.port = port;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  res.json({ status: true, message: `Porta ${port} salva com sucesso.` });
});

// Servidor WebSocket para impressão
const wss = new WebSocketServer({ port: 3002 });
wss.on('connection', (ws: WebSocket) => {
  ws.on('message', async (data: any) => {
    try {
      const { text } = JSON.parse(data.toString());
      if (!Array.isArray(text)) {
        ws.send(JSON.stringify({ status: false, message: 'Payload inválido. Esperado: { text: [string, ...] }' }));
        return;
      }
      const ports = await SerialPort.list();
      let selectedPort = ports.find(p => p.path === config.port) || ports[0];
      if (!selectedPort) {
        ws.send(JSON.stringify({ status: false, message: 'Nenhuma porta serial disponível.' }));
        return;
      }
      const cleanText = text.map((line: string) => line.replace(/[^\x20-\x7E]/g, '')).join('\n');
      const options: SerialPortOpenOptions<any> = {
        path: selectedPort.path,
        baudRate: 9600,
        lock: false,
        autoOpen: false
      };
      const printer = new SerialPort(options);
      printer.open(err => {
        if (err) {
          ws.send(JSON.stringify({ status: false, message: 'Erro ao abrir porta: ' + err.message }));
          return;
        }
        printer.write(cleanText + '\n\n', 'utf8', err => {
          if (err) {
            printer.close();
            ws.send(JSON.stringify({ status: false, message: 'Erro na impressão: ' + err.message }));
          } else {
            setTimeout(() => {
              printer.close();
            }, 500);
            ws.send(JSON.stringify({ status: true, message: 'Impressão enviada com sucesso.' }));
          }
        });
      });
    } catch (err: any) {
      ws.send(JSON.stringify({ status: false, message: err.message }));
    }
  });
});

export function startServer() {
  const PORT = 3001;
  app.listen(PORT, () => {
    console.log(`Servidor de impressão ativo em http://localhost:${PORT}`);
  });
}