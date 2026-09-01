# Chevronar - Sistema de Gestión Comercial (Frontend)

Este es el repositorio Frontend para el **Sistema de Gestión Comercial (SGC)** de Chevronar. Es una aplicación robusta diseñada para manejar facturación, presupuestos, control de productos, clientes y ciudades de manera ágil y con un alto rendimiento.

## 🚀 Características Principales

*   **Facturación (Integración AFIP):** Generación y control de Facturas (A y B) y Notas de Crédito (A y B) con sus respectivos CAE.
*   **Gestión de Ventas y Presupuestos:** Creación de presupuestos y remitos de venta con asignación de clientes, métodos de pago múltiples y detalle de precios con/sin IVA.
*   **Gestión de Productos:** 
    *   Búsqueda veloz en tiempo real y soporte para lector de código de barras.
    *   Control de precios, stock e historial de ventas por producto.
*   **Clientes y Ciudades:** Padrón de clientes centralizado asociado a ciudades, con manejo de condiciones frente al IVA (Inscripto, Exento, Consumidor final, etc.) y CUIT/CUIL/DNI.
*   **Control de Accesos (Roles):** Sistema de sesiones con vistas dinámicas dependiendo de los permisos del usuario (Administrador, Vendedor, etc.).
*   **Optimización de Alto Rendimiento:** Implementación de code-splitting (carga diferida de módulos), memoización de contextos y renderizado dinámico de grandes volúmenes de datos.

## 🛠️ Stack Tecnológico

El proyecto está desarrollado con las últimas tecnologías del ecosistema moderno de React:

*   **Librería Principal:** [React 18](https://react.dev/)
*   **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
*   **Empaquetador y Build Tool:** [Vite](https://vitejs.dev/) (con `@vitejs/plugin-react-swc` para compilación super rápida).
*   **Estilos y UI:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Manejo de Formularios y Validación:** [Formik](https://formik.org/) + [Yup](https://github.com/jquense/yup)
*   **Enrutamiento:** [React Router v7](https://reactrouter.com/)
*   **Notificaciones y Alertas:** [Sonner](https://sonner.emilkowal.ski/) y [SweetAlert2](https://sweetalert2.github.io/)
*   **Formatos especiales:** `react-number-format` para el manejo preciso de divisas y precios.
*   **Íconos:** [Lucide React](https://lucide.dev/)

## ⚙️ Requisitos Previos

Para correr este proyecto necesitas tener instalado en tu sistema:
*   [Node.js](https://nodejs.org/) (Se recomienda versión 18+ o 20 LTS)
*   NPM (viene incluido con Node)

## 📦 Instalación y Ejecución Local

1. Clona este repositorio o descarga los archivos en tu entorno local.
2. Abre una terminal en la raíz del proyecto.
3. Instala las dependencias ejecutando:
   ```bash
   npm install
   ```
4. Configura las variables de entorno. Crea un archivo `.env` en la raíz (puedes guiarte por la sección inferior de *Variables de Entorno*) y establece los valores para desarrollo.
5. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
6. El proyecto estará disponible por defecto en `http://localhost:5173`.

## 🏗️ Estructura del Proyecto

```text
src/
├── components/       # Componentes reusables, modales y layouts (ui, budgets, invoices, products, sales, etc.)
├── constants/        # Variables constantes, listados estáticos (provincias, roles, links, etc.)
├── context/          # Proveedores de estado global (Session, Clients, Cities, etc.)
├── helpers/          # Consultas HTTP y servicios al backend (Queries para productos, facturas, auth, etc.)
├── hooks/            # Custom React Hooks para extraer la lógica de estado y llamadas (useProducts, useSession, etc.)
├── pages/            # Vistas principales correspondientes a cada ruta
├── routes/           # Configuración de enrutamiento y Code Splitting (React.lazy)
└── utils/            # Funciones utilitarias (formateo de precios, fechas) y schemas de validación de Yup
```

## 🔐 Variables de Entorno

El proyecto requiere un archivo `.env` configurado en la raíz para establecer las conexiones con el backend. A continuación un ejemplo de cómo debería verse:

```env
# Define el entorno de ejecución (development o production)
VITE_NODE_ENV=development

# URL de la API (Backend) en el entorno local
VITE_API_URL_LOCAL=http://localhost:1479

# URL de la API (Backend) para entornos desplegados
VITE_API_URL_DEPLOY=/api
```

## 🔨 Scripts Disponibles

- `npm run dev`: Inicia el servidor local de Vite.
- `npm run build`: Compila el proyecto con TypeScript y genera la carpeta `dist` para producción.
- `npm run lint`: Corre ESLint para analizar y reportar problemas en el código fuente.
- `npm run preview`: Previsualiza de forma local la versión compilada para producción.
