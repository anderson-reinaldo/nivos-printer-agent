import instance from "./axios";

export function getPorts(): Promise<{data:{ status: boolean; ports: string[] }}> {
  return instance.get('/ports');
}

export function selectPort(port: string): Promise<{data: { status: boolean; message?: string }}> {
  return instance.post('/select-port', { port });
}

export function getSelectedPort(): Promise<{ data: { status: boolean; port: string }}> {
  return instance.get('/selected-port');
}

export function print(text: string): Promise<{data: { status: boolean; message?: string }}> {
  return instance.post('/print', { text });
}