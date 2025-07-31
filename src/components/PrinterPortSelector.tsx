import React from 'react';

interface PrinterPortSelectorProps {
  ports: Array<{ path: string; friendlyName: string }>;
  selectedPort: string;
  setSelectedPort: (port: string) => void;
  handleSave: () => void;
  saveStatus: string;
}

const PrinterPortSelector: React.FC<PrinterPortSelectorProps> = ({
  ports,
  selectedPort,
  setSelectedPort,
  handleSave,
  saveStatus,
}) => (
  <div className="w-full my-6">
    <label className="font-semibold text-base">Selecione a porta da impressora:</label>
    <select
      className="w-full p-2 my-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
      value={selectedPort}
      onChange={e => setSelectedPort(e.target.value)}
    >
      <option value="">-- Escolha uma porta --</option>
      {ports.map(port => (
        <option key={port.path} value={port.path}>
          {port.friendlyName || port.path}
        </option>
      ))}
    </select>
    <button
      className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      onClick={handleSave}
      disabled={!selectedPort}
    >
      Salvar
    </button>
    <div className="mt-2 text-blue-600 min-h-[20px]">{saveStatus}</div>
  </div>
);

export default PrinterPortSelector;
