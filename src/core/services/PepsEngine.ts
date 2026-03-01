import { Batch, OutflowRequest, OutflowResult } from '../models/types';
import { BusinessConfig } from '../../config/tenantConfig';

/**
 * PepsEngine class handles the core logic for the First-In, First-Out (PEPS/FIFO) algorithm.
 * It strictly operates on the domain models without any database dependencies, making it fully testable.
 */
export class PepsEngine {
    /**
     * Processes an outflow request against a given set of available batches.
     * Modifies the `Saldo` of the provided batches in memory.
     * 
     * @param availableBatches List of batches for the requested product, MUST BE SORTED BY DATE / ARRIVAL ASCENDING (First In, First Out)
     * @param request The requested outflow
     * @returns An OutflowResult indicating how much was drawn from which batch and the associated costs.
     */
    public static processOutflow(
        availableBatches: Batch[],
        request: OutflowRequest
    ): OutflowResult {
        const result: OutflowResult = {
            status: 'CANCELLED',
            totalQuantityProcessed: 0,
            remainingQuantityToProcess: request.CantidadSolicitada,
            totalCostOfSales: 0,
            batchDeductions: [],
        };

        if (request.CantidadSolicitada <= 0) {
            return result;
        }

        // Process PEPS
        for (const batch of availableBatches) {
            if (result.remainingQuantityToProcess <= 0) {
                break; // Request fully fulfilled
            }

            if (batch.Saldo <= 0) {
                continue; // Empty batch
            }

            // Determine how much we can take from this batch
            const quantityToTake = Math.min(batch.Saldo, result.remainingQuantityToProcess);

            // Deduct from memory
            batch.Saldo -= quantityToTake;

            const totalCostFromBatch = quantityToTake * batch.Costo_Unitario_Neto;

            // Update Result
            result.remainingQuantityToProcess -= quantityToTake;
            result.totalQuantityProcessed += quantityToTake;
            result.totalCostOfSales += totalCostFromBatch;

            result.batchDeductions.push({
                batchId: batch.id,
                quantityDeducted: quantityToTake,
                unitCost: batch.Costo_Unitario_Neto,
                totalCost: totalCostFromBatch
            });
        }

        // Determine final status based on tenant configuration
        if (result.remainingQuantityToProcess === 0) {
            result.status = 'COMPLETED';
        } else {
            // Did not fully fulfill the request
            if (BusinessConfig.outOfStockPolicy === 'BLOCK') {
                // Revert changes in memory (the caller should also discard the modified batches anyway)
                // But for pure function behavior, we return CANCELLED.
                result.status = 'CANCELLED';
            } else {
                // PENDING state
                result.status = 'PENDING';
            }
        }

        return result;
    }
}
