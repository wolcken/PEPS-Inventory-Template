export type MovementType = 'IN' | 'OUT' | 'ADJUST' | 'INITIAL';
export type OutflowStatus = 'COMPLETED' | 'PENDING' | 'CANCELLED';

export interface Product {
    id: string;
    Codigo: string;
    Nombre: string; // Refactored from "Medicamento"
    Descripcion: string;
    UnidadMedida: string;
}

export interface Batch {
    id: string;
    id_Insumo: string; // Relates to Product.id
    Codigo: string; // Relates to Product.Codigo

    FechaNumber: number; // For sorting and PEPS logic (timestamp)
    FechaString: string;
    Caducidad?: string;

    id_Provider: string;
    Nit: number;
    Factura: number;

    CantidadInicial: number;
    Saldo: number; // Current available quantity in this batch

    Precio_Unitario: number;
    Costo_Unitario_Neto: number; // The actual cost used for PEPS
}

export interface InflowRequest {
    id_Insumo: string;
    Codigo: string;
    id_Provider: string;
    Nit: number;
    Factura: number;
    FechaString: string;
    FechaNumber: number;
    Caducidad?: string;
    Precio_Unitario: number;
    Cantidad: number;
}

export interface OutflowRequest {
    id_Insumo: string;
    Codigo: string;
    Unidad_Medida: string;
    Cliente: string;
    Nit: number;
    Factura: number;
    FechaString: string;
    FechaNumber: number;
    CantidadSolicitada: number;
}

// Result of the PEPS Engine calculation
export interface OutflowResult {
    status: OutflowStatus;
    totalQuantityProcessed: number;
    remainingQuantityToProcess: number;
    totalCostOfSales: number;
    batchDeductions: Array<{
        batchId: string;
        quantityDeducted: number;
        unitCost: number;
        totalCost: number;
    }>;
}

// A single outflow event recorded in DB
export interface OutflowRecord {
    id?: string;
    id_Insumo: string;
    Codigo: string;
    FechaString: string;
    FechaNumber: number; // To keep chronological order even inside the same operation
    Nit: number;
    Cliente: string;
    Factura: number;
    Unidad_Medida: string;
    Cantidad: number; // The specific quantity from one batch
    Costo_Unitario_Neto: number; // The specific cost from that batch
    Costo_Total: number; // Cantidad * Costo_Unitario_Neto
    Status: OutflowStatus;
    BatchId_Ref?: string; // The batch from which this was deducted (if completed)
}
