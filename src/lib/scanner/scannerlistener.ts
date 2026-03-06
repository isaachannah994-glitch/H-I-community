import { useEffect } from 'react';

// Hook Senior para capturar entradas de escáner sin necesidad de un campo de texto activo
export const useBarcodeScanner = (onScan: (barcode: string) => void) => {
  useEffect(() => {
    let buffer = "";
    let lastKeyTime = Date.now();

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentTime = Date.now();
      
      // Los escáneres envían las teclas muy rápido (< 30ms entre teclas)
      if (currentTime - lastKeyTime > 50) {
        buffer = ""; // Si pasó mucho tiempo, no es un escáner, es un humano escribiendo
      }

      if (e.key === 'Enter') {
        if (buffer.length > 3) {
          onScan(buffer);
          buffer = "";
        }
      } else {
        buffer += e.key;
      }
      
      lastKeyTime = currentTime;
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onScan]);
};
