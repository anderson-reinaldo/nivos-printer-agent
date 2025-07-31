import React, { useEffect, useState } from 'react';
import PrinterHeader from './PrinterHeader';
import PrinterPortSelector from './PrinterPortSelector';
import PrinterTestButton from './PrinterTestButton';
import PrinterInstructions from './PrinterInstructions';

const PrinterPanel: React.FC = () => {
  const [ports, setPorts] = useState<any[]>([]);
  const [selectedPort, setSelectedPort] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [printStatus, setPrintStatus] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/ports')
      .then(res => res.json())
      .then(data => setPorts(data.ports || []));
  }, []);

  const handleSave = async () => {
    const res = await fetch('http://localhost:3001/select-port', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ port: selectedPort })
    });
    const data = await res.json();
    setSaveStatus(data.message);
  };

  const handleTestPrint = () => {
    setPrintStatus('Imprimindo...');
    const ws = new window.WebSocket('ws://localhost:3002');
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
    <div style={{ maxWidth: 420, margin: '32px auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #0002', padding: '36px 28px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <PrinterHeader />
      <PrinterPortSelector
        ports={ports}
        selectedPort={selectedPort}
        setSelectedPort={setSelectedPort}
        handleSave={handleSave}
        saveStatus={saveStatus}
      />
      <PrinterTestButton
        handleTestPrint={handleTestPrint}
        printStatus={printStatus}
      />
      <PrinterInstructions />
    </div>
  );
};

export default PrinterPanel;
