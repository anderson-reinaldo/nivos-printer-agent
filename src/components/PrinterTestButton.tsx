import React, { useEffect, useRef, useState } from 'react';

interface PrinterTestButtonProps {
  handleTestPrint: () => void;
  printStatus: string;
  disable?: boolean;
}

const getStatusType = (status: string) => {
  if (!status) return 'idle';
  if (status === 'Imprimindo...') return 'loading';
  if (/sucesso/i.test(status)) return 'success';
  if (/erro|falha|não/i.test(status)) return 'error';
  return 'info';
};

const statusMessages: Record<string, string> = {
  idle: 'Clique para testar a impressão',
  loading: 'Aguarde, teste de impressão em andamento...',
  success: 'Impressão realizada com sucesso!',
  error: 'Ocorreu um erro ao imprimir. Verifique a impressora e tente novamente.',
  info: 'Status da impressão exibido aqui.'
};

const PrinterTestButton: React.FC<PrinterTestButtonProps> = ({ handleTestPrint, printStatus, disable }) => {
  const statusType = getStatusType(printStatus);
  const isLoading = statusType === 'loading';
  const isDisabled = !!disable || isLoading;
  const tooltip =
    disable
      ? 'Selecione e salve uma porta antes de testar'
      : isLoading
      ? statusMessages.loading
      : statusType === 'success'
      ? statusMessages.success
      : statusType === 'error'
      ? statusMessages.error
      : statusMessages.idle;

  // Foco automático no botão em caso de erro
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (statusType === 'error' || statusType === 'success') {
      setShowModal(true);
      if (buttonRef.current) buttonRef.current.focus();
    } else {
      setShowModal(false);
    }
  }, [statusType]);

  return (
    <div className="flex flex-col items-center">
      {/* Modal de erro ou sucesso */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className={`bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 max-w-md w-full border relative animate-fade-in
            ${statusType === 'error' ? 'border-red-400 dark:border-red-500' : 'border-emerald-400 dark:border-emerald-500'}`}>
            <h3 className={`text-lg font-bold mb-2 flex items-center gap-2
              ${statusType === 'error' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              {statusType === 'error' ? (
                <>
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" /></svg>
                  Erro ao imprimir
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Impressão realizada
                </>
              )}
            </h3>
            <div className={`text-base mb-3 break-words
              ${statusType === 'error' ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{printStatus}</div>
            {statusType === 'error' ? (
              <div className="text-xs text-gray-700 dark:text-gray-300 mb-4">
                Dica: Verifique se a impressora está conectada, ligada e se a porta está correta.<br />
                Se o problema persistir, tente reiniciar o agente ou o computador.
              </div>
            ) : (
              <div className="text-xs text-gray-700 dark:text-gray-300 mb-4">
                Sua impressora respondeu corretamente ao teste.<br />
                Agora você pode imprimir normalmente pelo sistema.
              </div>
            )}
            <button
              className={`mt-2 px-4 py-2 rounded font-semibold focus:outline-none focus:ring-2
                ${statusType === 'error'
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-400 dark:bg-red-700 dark:hover:bg-red-800 dark:focus:ring-red-600'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-400 dark:bg-emerald-700 dark:hover:bg-emerald-800 dark:focus:ring-emerald-600'}`}
              onClick={() => setShowModal(false)}
              autoFocus
            >
              Fechar
            </button>
          </div>
        </div>
      )}
      <button
        ref={buttonRef}
        className={`relative px-6 py-2 rounded-lg font-semibold text-base shadow focus:outline-none transition-colors duration-150
          bg-emerald-600 text-white hover:bg-emerald-700
          dark:bg-emerald-700 dark:hover:bg-emerald-800
          focus:ring-2 focus:ring-emerald-400 dark:focus:ring-emerald-600
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={isDisabled ? undefined : handleTestPrint}
        type="button"
        disabled={isDisabled}
        title={tooltip}
        aria-busy={isLoading}
        aria-disabled={isDisabled}
        tabIndex={0}
        aria-label={tooltip}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" /></svg>
            Imprimindo...
          </span>
        ) : (
          'Testar Impressão'
        )}
      </button>
    </div>
  );
};

export default PrinterTestButton;
