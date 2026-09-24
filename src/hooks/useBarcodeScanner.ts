import { useRef } from "react";

// Un lector de códigos "tipea" cada carácter a pocos ms del anterior; una persona,
// nunca por debajo de ~35 ms. Así se distingue un escaneo de alguien escribiendo.
const SCAN_MAX_KEY_INTERVAL_MS = 35;
const SCAN_MIN_LENGTH = 5;
// Los lectores escriben las mayúsculas con Shift + letra: las teclas
// modificadoras no cortan la ráfaga ni cuentan como pausa
const MODIFIER_KEYS = new Set(["Shift", "CapsLock", "Control", "Alt", "AltGraph", "Meta"]);

// Mismo formato con el que el backend guarda y busca los códigos
export const normalizeBarcode = (code: string): string =>
  code.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

interface Options {
  // Se escaneó un código (ya normalizado)
  onScan: (code: string) => void;
  // Se apretó Enter escribiendo a mano
  onManualEnter: () => void;
}

// Devuelve el onKeyDown del input de búsqueda
const useBarcodeScanner = ({ onScan, onManualEnter }: Options) => {
  // Caracteres de la ráfaga actual de teclas rápidas (el código escaneado)
  const scanRef = useRef({ buffer: "", lastKeyAt: 0 });

  return (e: React.KeyboardEvent<HTMLInputElement>) => {
    const now = performance.now();
    const scan = scanRef.current;
    const isFastKey = now - scan.lastKeyAt < SCAN_MAX_KEY_INTERVAL_MS;

    const isPrintableKey =
      e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    if (isPrintableKey) {
      // Sigue la ráfaga si la tecla llegó rápido; si no, empieza una nueva
      scan.buffer = isFastKey ? scan.buffer + e.key : e.key;
      scan.lastKeyAt = now;
      return;
    }

    if (MODIFIER_KEYS.has(e.key)) return;

    if (e.key !== "Enter") {
      scan.buffer = "";
      return;
    }
    e.preventDefault();

    const isScan = isFastKey && scan.buffer.length >= SCAN_MIN_LENGTH;
    // El código es lo escaneado, no el texto del input (que puede tener un
    // producto seleccionado antes)
    const code = normalizeBarcode(scan.buffer);
    scan.buffer = "";
    scan.lastKeyAt = 0;

    if (isScan && code) {
      onScan(code);
      return;
    }
    onManualEnter();
  };
};

export default useBarcodeScanner;
