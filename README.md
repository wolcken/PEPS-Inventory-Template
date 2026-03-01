# Modelo PEPS Base (React + TypeScript)

Este proyecto es una refactorización de un sistema de inventario (anteriormente enfocado a farmacias) hacia un **Modelo Base PEPS de Inventario**, diseñado con una arquitectura limpia, modular y tipado estricto mediante TypeScript.

El objetivo de este proyecto es servir como un producto "core" (núcleo base) reutilizable y fácilmente personalizable para distintos tipos de negocios (Ferreterías, Mini-markets, Farmacias, etc.) con el menor esfuerzo posible.

## Características Principales

-   **Motor PEPS Aislado (`src/core`)**: La lógica matemática para calcular Primeras Entradas, Primeras Salidas (FIFO/PEPS) está encapsulada en su propio módulo testeable e independiente de la vista.
-   **Tipado con TypeScript**: Prevención de errores en tiempo de desarrollo. Todos los modelos de dominio (Lotes, Movimientos, Productos) están estrictamente tipados.
-   **Configuración por Inquilino (Tenant)**: Permite personalizar reglas de negocio sin tocar el código fuente mediante el archivo `src/config/tenantConfig.ts` (Ej: Cambiar el factor de impuestos o las etiquetas visuales).
-   **Modelo de Datos Genérico**: Abstracción de términos (ej. "Medicamento" -> "Nombre") para que el inventario pueda manejar cualquier tipo de ítem.
-   **Estado de Salidas "Pendientes"**: Capacidad de registrar salidas incluso cuando no hay stock suficiente, dejando el remanente en estado *PENDING* para ser procesado cuando ingrese nueva mercadería (Backorder).

## Arquitectura del Proyecto

El proyecto sigue componentes de Clean Architecture para asegurar su mantenibilidad:

```
src/
├── api/                   # (Infrastructure) Controladores y adaptadores. Ej: InventoryController.ts, DBfirestore.ts
├── config/                # Configuraciones de negocio (tenantConfig.ts)
├── core/                  # (Dominio) Lógica de puro TypeScript. Cero dependencias React/Firebase.
│   ├── models/            # Interfaces de Typescript (types.ts)
│   ├── services/          # El Motor de Cálculo PEPS (PepsEngine.ts)
│   └── __tests__/         # Pruebas Unitarias (Jest)
├── components/            # Componentes reutilizables de Interfaz de Usuario (.tsx)
├── firebase/              # Configuración y credenciales de acceso a Firebase.
├── pages/                 # Vistas principales de Rutas (Ej: KardexEntrada.tsx, KardexSalida.tsx)
└── utils/                 # Funciones auxiliares genéricas (.ts)
```

## Configuración y Personalización

Para adaptar el Modelo PEPS a un nuevo modelo de negocio, edita el archivo `src/config/tenantConfig.ts`:

```typescript
export const BusinessConfig = {
    // Etiqueta para el producto en la UI (ej: "Medicamento", "Artículo", "Repuesto")
    productLabel: 'Nombre',
    
    // Factor para calcular costo neto basado en impuestos locales. 
    // Ej: 0.87 (descuenta 13% de IVA), 1.0 (Sin deducción)
    TAX_DEDUCTION_FACTOR: 0.87,

    // Política para salidas que exceden el stock:
    // 'BLOCK': Lanza error y no procesa nada.
    // 'PENDING': Procesa lo disponible y deja el resto pendiente (Backorder).
    outOfStockPolicy: 'PENDING',
}
```

## Scripts Disponibles

Este proyecto fue inicializado con Create React App. Se han añadido configuraciones para compilar y testear TypeScript:

-   `npm start`: Inicia la aplicación en modo desarrollo.
-   `npm test`: Ejecuta la suite de pruebas unitarias (Jest) para el Motor PEPS.
-   `npm run build`: Compila la aplicación optimizada para producción.

*(Nota: los tipos de React e importaciones de JSX se resuelven bajo el config `react-jsx` de `tsconfig.json`)*
