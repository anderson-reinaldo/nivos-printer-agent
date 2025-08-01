import React, { useMemo, useState, useEffect } from 'react';
import PrinterTestButton from './PrinterTestButton';
import { getSelectedPort } from '../services';

interface PrinterPortSelectorProps {
  ports: Array<{ path: string; friendlyName: string }>;
  selectedPort: string;
  setSelectedPort: (port: string) => void;
  handleSave: () => void;
  saveStatus: string;
  handleTestPrint: () => void;
  printStatus: string;
}

const PrinterPortSelector: React.FC<PrinterPortSelectorProps> = ({
  ports,
  selectedPort,
  setSelectedPort,
  handleSave,
  saveStatus,
  handleTestPrint,
  printStatus
}) => {
  const noPorts = useMemo(() => ports.length === 0, [ports]);
  const isPortInvalid = !selectedPort && !noPorts;
  const isSaveDisabled = !selectedPort || noPorts;

  const [showModal, setShowModal] = useState(false);
  const [savedPort, setSavedPort] = useState<string | null>(null);

  useEffect(() => {
    // Buscar porta salva ao montar
    (async () => {
     await getSelectedPort()
      .then(({ data }) => {
        if (data.status && data.port) {
          setSavedPort(data.port);
          if (data.port) {
            setSelectedPort(data.port);
          }
        } else {
          setSavedPort(null);
        }
      })
      .catch(() => setSavedPort(null));
    })();
  }, []);

  const saveStatusType =
    saveStatus.toLowerCase().includes('sucesso') ? 'success' :
    saveStatus.toLowerCase().includes('erro') ? 'error' :
    saveStatus ? 'info' : '';

  useEffect(() => {
    if (saveStatusType === 'success') {
      setSavedPort(selectedPort);
      setShowModal(true);
    }
  }, [saveStatusType]);

  const savedPortName = ports.find(p => p.path === savedPort)?.friendlyName || savedPort;

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPort(e.target.value);
  };

  const handleSaveClick = async () => {
    await handleSave();
    if (selectedPort && selectedPort !== savedPort && saveStatus.toLowerCase().includes('sucesso')) {
      setSavedPort(selectedPort);
      setShowModal(true);
    }
  };

  return (
    <div className="w-full">
      {/* Modal de confirmação de porta salva */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 max-w-md w-full border border-emerald-400 dark:border-emerald-500 relative animate-fade-in">
            <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-2 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Porta salva com sucesso
            </h3>
            <div className="text-base text-emerald-700 dark:text-emerald-300 mb-3 break-words">
              Impressora/porta salva: <span className="font-semibold">{savedPortName}</span>
            </div>
            <button
              className="mt-2 px-4 py-2 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 dark:bg-emerald-700 dark:hover:bg-emerald-800 dark:focus:ring-emerald-600"
              onClick={() => setShowModal(false)}
              autoFocus
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <label className="font-semibold text-base text-gray-800 dark:text-gray-200" htmlFor="printer-port-select">
        Selecione a porta da impressora:
      </label>
      <select
        id="printer-port-select"
        className={`w-full p-2 my-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600
          bg-white dark:bg-zinc-900 text-gray-900 dark:text-gray-100
          ${isPortInvalid ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-zinc-700'}`}
        value={selectedPort}
        onChange={handleSelectChange}
        disabled={noPorts}
        aria-invalid={isPortInvalid}
        aria-required="true"
      >
        <option value="">-- Escolha uma porta --</option>
        {ports.map(port => (
          <option key={port.path} value={port.path}>
            {port.friendlyName || port.path}
          </option>
        ))}
      </select>

      {noPorts && (
        <div className="text-red-500 dark:text-red-400 text-sm mb-2">
          Nenhuma porta encontrada. Conecte a impressora e recarregue.
        </div>
      )}
      {isPortInvalid && !noPorts && (
        <div className="text-red-500 dark:text-red-400 text-xs mb-2">
          Selecione uma porta para continuar.
        </div>
      )}

      <div className="flex flex-row items-center justify-between gap-2 mt-2">
        {savedPort && (
          <div className="mb-2 text-sm text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Porta atualmente salva: <span className="font-semibold">{savedPortName}</span>
          </div>
        )}

        {!savedPort && (
          <div className="mb-2 text-sm text-red-700 dark:text-red-300 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            Nenhuma porta salva
          </div>
        )}

        <div className="flex flex-row items-end gap-2 mt-2">
          <PrinterTestButton
            handleTestPrint={handleTestPrint}
            printStatus={printStatus}
            disable={isPortInvalid || noPorts}
          />
          <button
            className={`px-6 py-2 rounded-md font-semibold transition disabled:opacity-50 flex items-center gap-2
              bg-blue-600 text-white hover:bg-blue-700
              dark:bg-blue-700 dark:hover:bg-blue-800`}
            onClick={handleSaveClick}
            disabled={isSaveDisabled}
            title={isSaveDisabled ? 'Selecione uma porta válida para salvar' : 'Salvar porta selecionada'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
            Salvar Porta
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrinterPortSelector;
