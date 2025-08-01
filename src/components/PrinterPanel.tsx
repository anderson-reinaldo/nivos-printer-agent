import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PrinterHeader from './PrinterHeader';
import PrinterPortSelector from './PrinterPortSelector';
import PrinterInstructions from './PrinterInstructions';
import { getPorts, selectPort } from '../services';

const PrinterPanel: React.FC = () => {
  const [ports, setPorts] = useState<any[]>([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [printStatus, setPrintStatus] = useState('');

  useEffect(() => {
    (async () => {
     await getPorts()
      .then(res => {
        setPorts(res.data.ports || [])
      });})();
  }, []);

  const handleSave = async () => {
    const res = await selectPort(selectedPort);
    setSaveStatus(res.data.message);
  };

  const handleTestPrint = () => {
    setPrintStatus('Imprimindo...');
    const ws = new window.WebSocket('ws://localhost:4101');
    ws.onopen = () => {
      ws.send(JSON.stringify({ text: ['*** TESTE DE IMPRESSÃO ***', 'Se você está lendo isso, o agente está funcionando!', 'Data: ' + new Date().toLocaleString()] }));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrintStatus(data.message);
      ws.close();
    };
    ws.onerror = () => setPrintStatus('Erro ao conectar ao agente de impressão.');
  };

  return (
    <div className='flex p-2 flex-col items-center justify-between'>
        <PrinterHeader />
        <PrinterPortSelector
          handleTestPrint={handleTestPrint}
          printStatus={printStatus}
          ports={ports}
          selectedPort={selectedPort}
          setSelectedPort={setSelectedPort}
          handleSave={handleSave}
          saveStatus={saveStatus}
        />
        <PrinterInstructions />
    </div>
  );
};

export default PrinterPanel;
