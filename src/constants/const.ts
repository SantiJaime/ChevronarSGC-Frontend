export const config = import.meta.env.VITE_NODE_ENV === "production";

export const URL: string = config
  ? import.meta.env.VITE_API_URL_DEPLOY
  : import.meta.env.VITE_API_URL_LOCAL;

export const CREDIT_CARDS = [
  "Naranja",
  "Visa",
  "Mastercard",
  "American Express",
  "Cabal",
  "Sol",
  "Credimas",
  "Sucredito",
  "Titanio",
];

export const DEBIT_CARDS = ["Visa", "Mastercard | Maestro", "Cabal"];

export const SALE_CONDITIONS = [
  "Contado",
  "Crédito",
  "Débito",
  "Transferencia",
  "Cheque",
  "Múltiples métodos de pago",
];

export const ARG_PROVINCES = [
  "Buenos Aires",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];
export const SALE_POINTS = [
  {
    name: "Av. San Martín 112 - 00011",
    value: "00011",
  },
  {
    name: "Av. Colón 315 - 00012",
    value: "00012",
  },
];

export const BUDGET_SALE_POINTS = [
  {
    name: "Av. San Martín 112 - 00002",
    value: "00002",
  },
  {
    name: "Av. Colón 315 - 00003",
    value: "00003",
  },
];
export const NAV_LINKS = [
  "Creación de facturas",
  "Historial de facturas",
  "Creación de presupuestos",
  "Historial de presupuestos",
  "Ciudades",
  "Clientes"
] as const;

export const NAV_LINKS_MENU_CREACION = [
  "Clientes",
  "Ciudades",
] as const;

export const NAV_LINKS_FACTURAS = [
  "Creación de facturas",
  "Historial de facturas",
] as const;

export const NAV_LINKS_PRESUPUESTOS = [
  "Creación de presupuestos",
  "Historial de presupuestos",
] as const;

export const NAV_LINKS_OBJECT = [
  {
    label: "Facturas",
    path: "/facturas",
  },
  {
    label: "Presupuestos",
    path: "/presupuestos",
  },
  {
    label: "Menú de creación",
    path: "/menu-de-creacion",
  },
]

export const CUIT_MAP = [
  {
    value: "0",
    label: "Mohadile, Natalia Alejandra",
  },
  {
    value: "1",
    label: "Chevronar SRL - AÚN NO DISPONIBLE",
  },
];
