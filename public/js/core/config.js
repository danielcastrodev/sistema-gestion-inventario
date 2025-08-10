// Application configuration and constants
const CONFIG = {
    // LocalStorage keys
    PRODUCTS_KEY: 'products',
    SETTINGS_KEY: 'settings',
    
    // Default values
    DEFAULT_LOW_STOCK_THRESHOLD: 5,
    DEFAULT_CURRENCY: 'CLP',
    
    // Modal IDs
    PRODUCT_MODAL_ID: 'productModal',
    
    // Table IDs
    PRODUCTS_TABLE_ID: 'productsTable',
    RECENT_PRODUCTS_ID: 'recentProducts',
    LOW_STOCK_PRODUCTS_ID: 'lowStockProducts',
    
    // Form element IDs
    PRODUCT_FORM_ID: 'productForm',
    PRODUCT_ID_INPUT: 'productId',
    PRODUCT_NAME_INPUT: 'productName',
    PRODUCT_CATEGORY_INPUT: 'productCategory',
    PRODUCT_PRICE_INPUT: 'productPrice',
    PRODUCT_STOCK_INPUT: 'productStock',
    PRODUCT_LOW_STOCK_INPUT: 'productLowStock',
    
    // Settings element IDs
    COMPANY_NAME_INPUT: 'companyName',
    LOW_STOCK_THRESHOLD_INPUT: 'lowStockThreshold',
    CURRENCY_SELECT: 'currency',
    
    // Dashboard element IDs
    TOTAL_PRODUCTS_ID: 'totalProducts',
    TOTAL_VALUE_ID: 'totalValue',
    LOW_STOCK_COUNT_ID: 'lowStock'
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    window.CONFIG = CONFIG;
}