import React from 'react';
import PrinterIcon from '../../assets/icon_no_shape.png';

const PrinterHeader: React.FC = () => (
  <div className="flex flex-col items-center gap-3 mb-2 animate-fade-in">
    <div className="bg-white dark:bg-zinc-800 p-3 rounded-full shadow-md border border-gray-200 dark:border-zinc-700">
      <img
        src={PrinterIcon}
        alt="Impressora"
        className="w-14 h-14 object-contain drop-shadow-md"
      />
    </div>
    <h2 className="text-[1.75rem] font-extrabold tracking-tight text-gray-900 dark:text-white text-center">
      Agente de Impressão Local
    </h2>
    <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-sm">
      Configure e teste sua impressora conectada localmente para permitir impressões diretas do sistema.
    </p>
  </div>
);

export default PrinterHeader;
