export function WindowControls() {
  const handleMinimize = () => window.electronAPI?.minimizeWindow?.();
  const handleClose = () => window.electronAPI?.closeWindow?.();

  return (
    <div className="flex justify-end gap-2 p-2 backdrop-blur-md">
      <button
        onClick={handleMinimize}
        className="w-3 h-3 rounded-full bg-yellow-400 hover:brightness-110"
        title="Minimizar"
      />
      <button
        onClick={handleClose}
        className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110"
        title="Fechar"
      />
    </div>
  );
}
