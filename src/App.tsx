import React from 'react';
import './index.css';
import PrinterPanel from './components/PrinterPanel';
import AppLayout from './components/AppLayout';

const App: React.FC = () => {
  return (
    <AppLayout>
      <PrinterPanel />
    </AppLayout>
  );
};

export default App;
