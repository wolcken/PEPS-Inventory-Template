import { PepsEngine } from '../services/PepsEngine';
import { Batch, OutflowRequest } from '../models/types';
import { BusinessConfig } from '../../config/tenantConfig';

describe('PepsEngine', () => {
    const defaultRequest: OutflowRequest = {
        id_Insumo: 'test_product',
        Codigo: 'PRD-001',
        Unidad_Medida: 'UNIDAD',
        Cliente: 'Test Client',
        Nit: 123,
        Factura: 1,
        FechaString: '2023-01-01',
        FechaNumber: 12345,
        CantidadSolicitada: 10,
    };

    const createBatch = (id: string, saldo: number, cost: number): Batch => ({
        id,
        id_Insumo: 'test_product',
        Codigo: 'PRD-001',
        FechaNumber: 1,
        FechaString: '2023-01-01',
        id_Provider: 'p1',
        Nit: 1,
        Factura: 1,
        CantidadInicial: saldo,
        Saldo: saldo,
        Precio_Unitario: cost / 0.87, // just to fill the model
        Costo_Unitario_Neto: cost,
    });

    beforeEach(() => {
        // Reset to default config
        BusinessConfig.outOfStockPolicy = 'PENDING';
    });

    it('should fully fulfill an outflow request from a single batch', () => {
        const batches: Batch[] = [createBatch('b1', 20, 10)];
        const request = { ...defaultRequest, CantidadSolicitada: 5 };

        const result = PepsEngine.processOutflow(batches, request);

        expect(result.status).toBe('COMPLETED');
        expect(result.totalQuantityProcessed).toBe(5);
        expect(result.remainingQuantityToProcess).toBe(0);
        expect(result.totalCostOfSales).toBe(5 * 10);
        expect(batches[0].Saldo).toBe(15);
    });

    it('should split an outflow request across multiple batches (PEPS logic)', () => {
        const batches: Batch[] = [
            createBatch('b1', 5, 10), // Cost 10
            createBatch('b2', 15, 12) // Cost 12
        ];
        // Request 8 items
        const request = { ...defaultRequest, CantidadSolicitada: 8 };

        const result = PepsEngine.processOutflow(batches, request);

        expect(result.status).toBe('COMPLETED');
        expect(result.totalQuantityProcessed).toBe(8);
        // Should take 5 from b1 (cost 5*10=50) and 3 from b2 (cost 3*12=36)
        expect(result.totalCostOfSales).toBe(86);
        expect(result.batchDeductions.length).toBe(2);

        // Verify memory mutations
        expect(batches[0].Saldo).toBe(0);
        expect(batches[1].Saldo).toBe(12);
    });

    it('should handle OUT OF STOCK based on PENDING policy', () => {
        BusinessConfig.outOfStockPolicy = 'PENDING';

        const batches: Batch[] = [createBatch('b1', 5, 10)];
        const request = { ...defaultRequest, CantidadSolicitada: 10 };

        const result = PepsEngine.processOutflow(batches, request);

        expect(result.status).toBe('PENDING');
        expect(result.totalQuantityProcessed).toBe(5); // took all available
        expect(result.remainingQuantityToProcess).toBe(5); // 5 still pending
    });

    it('should handle OUT OF STOCK based on BLOCK policy', () => {
        BusinessConfig.outOfStockPolicy = 'BLOCK';

        const batches: Batch[] = [createBatch('b1', 5, 10)];
        const request = { ...defaultRequest, CantidadSolicitada: 10 };

        const result = PepsEngine.processOutflow(batches, request);

        // According to our logical implementation it returns CANCELLED
        expect(result.status).toBe('CANCELLED');
        expect(result.totalQuantityProcessed).toBe(5); // Mutated in memory but transaction should be dropped
    });

    it('should ignore empty batches', () => {
        const batches: Batch[] = [
            createBatch('b1', 0, 10),
            createBatch('b2', 5, 12)
        ];
        const request = { ...defaultRequest, CantidadSolicitada: 3 };

        const result = PepsEngine.processOutflow(batches, request);

        expect(result.status).toBe('COMPLETED');
        expect(batches[0].Saldo).toBe(0);
        expect(batches[1].Saldo).toBe(2);
        expect(result.batchDeductions.length).toBe(1);
        expect(result.batchDeductions[0].batchId).toBe('b2');
    });
});
