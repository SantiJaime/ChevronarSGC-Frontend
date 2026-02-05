export type TaxTable = Record<string | number, number>;

export const NARANJA_TAX: Record<number | string, number> = {
  1: 0,
  Z: 0,
  5: 0.15,
  6: 0.2,
};

export const VISA_TAX: Record<number, number> = {
  1: 0.05,
  3: 0.1,
  6: 0.2,
};

export const CREDIMAS_TAX: Record<number, number> = {
  3: 0.2,
};

export const SOL_TAX: Record<number, number> = {
  3: 0.35,
};

export const TAX_CONFIG: Record<string, TaxTable> = {
  Naranja: NARANJA_TAX,
  Visa: VISA_TAX,
  Mastercard: VISA_TAX,
  "American Express": VISA_TAX,
  Cabal: VISA_TAX,
  Credimas: CREDIMAS_TAX,
  Sucredito: CREDIMAS_TAX,
  Titanio: CREDIMAS_TAX,
  Sol: SOL_TAX,
};
