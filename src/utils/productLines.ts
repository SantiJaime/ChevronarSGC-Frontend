import { v4 as uuidv4 } from "uuid";

// Asigna un identificador de línea a los productos que no lo tienen (por ejemplo,
// los de una venta guardada, que vienen del backend sin él)
export const withLineIds = <T extends Product>(products: T[]): T[] =>
  products.map((product) =>
    product.lineId ? product : { ...product, lineId: uuidv4() },
  );

export const newLineId = (): string => uuidv4();

// Clave para las filas de la tabla (con respaldo por si una línea no tuviera id)
export const getLineKey = (product: Product, index: number): string =>
  product.lineId ?? `${product.productId}-${index}`;
