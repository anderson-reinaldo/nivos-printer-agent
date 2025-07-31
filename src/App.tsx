import React from 'react';
import './index.css';
import PrinterPanel from './components/PrinterPanel';

const App: React.FC = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'red' }}>
      <PrinterPanel />
    </div>
  );
};

export default App;
