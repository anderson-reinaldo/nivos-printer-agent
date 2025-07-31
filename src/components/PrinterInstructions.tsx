import React from 'react';

const PrinterInstructions: React.FC = (): React.ReactElement => (
  <div className="w-full text-gray-700 dark:text-gray-200 text-[15px] leading-relaxed">
    <h3 className="font-semibold text-[17px] mb-2">Como usar o agente de impressão:</h3>
    <ul className="pl-5 mb-2 list-disc">
      <li>1. Conecte sua impressora térmica ao computador.</li>
      <li>2. Selecione a porta correta na lista acima e clique em <b>Salvar</b>.</li>
      <li>3. Clique em <b>Testar Impressão</b> para garantir que está tudo funcionando.</li>
      <li>4. Deixe o agente rodando na bandeja do sistema para receber comandos de impressão.</li>
    </ul>
    <div className="text-[14px] text-gray-500 dark:text-gray-400">
      Dica: Se a impressora não aparecer, verifique se está conectada e instalada corretamente.<br />
      O agente precisa estar em execução para receber comandos do sistema.
    </div>
  </div>
);

export default PrinterInstructions;
