import React from 'react';

const PrinterHeader: React.FC = () => (
  <div className="flex flex-col items-center gap-2 mb-5">
    <img src="assets/printer-tray.png" alt="Impressora" className="w-12 h-12 drop-shadow-sm" />
    <h2 className="m-0 text-[#222] text-[1.45rem] font-bold tracking-wide">Agente de Impressão Local</h2>
    <div className="mt-2 text-green-500 font-medium text-[1.05rem] flex items-center">
      <svg width="18" height="18" viewBox="0 0 20 20" fill="#22c55e" className="inline align-middle"><circle cx="10" cy="10" r="10"/></svg>
      <span className="ml-1.5">Ativo</span>
    </div>
  </div>
);

export default PrinterHeader;
