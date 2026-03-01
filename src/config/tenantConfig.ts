/**
 * Tenant or Business Configuration for the PEPS Application.
 * This abstracts away specific pharmacy terms or fixed rules.
 */
export const BusinessConfig = {
    // Application details
    appName: "PEPS Base Model",

    // Label to use in the UI for the main product entity (e.g. "Medicamento", "Artículo", "Repuesto")
    productLabel: "Nombre",

    // How the unit cost is calculated. 
    // e.g. 0.87 means a 13% tax/deduction is applied to the gross price to get the net cost.
    // Set to 1.0 to use the raw price.
    TAX_DEDUCTION_FACTOR: 0.87,

    // Out Of Stock policy. 
    // If 'PENDING', sales that exceed stock will be recorded with 'PENDING' status instead of blocking the user or creating negative stock.
    // If 'BLOCK', the application must stop the transaction.
    outOfStockPolicy: 'PENDING' as 'PENDING' | 'BLOCK',
};
