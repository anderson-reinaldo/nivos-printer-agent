import React from 'react';

interface PrinterTestButtonProps {
  handleTestPrint: () => void;
  printStatus: string;
}

const PrinterTestButton: React.FC<PrinterTestButtonProps> = ({ handleTestPrint, printStatus }) => (
  <div style={{ width: '100%', margin: '18px 0' }}>
    <button
      style={{ padding: '10px 22px', borderRadius: 6, background: '#059669', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 16 }}
      onClick={handleTestPrint}
    >
      Testar Impressão
    </button>
    <div style={{ marginTop: 10, minHeight: 22, color: printStatus.includes('sucesso') ? '#059669' : printStatus.includes('Erro') ? '#ef4444' : '#2563eb' }}>
      {printStatus}
    </div>
  </div>
);

export default PrinterTestButton;
