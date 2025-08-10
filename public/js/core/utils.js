// Utility functions
const Utils = (function() {
    'use strict';
    
    // Format number as currency (CLP)
    function formatCurrency(value) {
        return parseFloat(value).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Format percentage
    function formatPercentage(value) {
        return parseFloat(value).toFixed(2);
    }
    
    // Generate unique ID
    function generateId() {
        return Date.now();
    }
    
    // Validate product data
    function validateProduct(product) {
        if (!product.name || !product.category || 
            isNaN(product.price) || isNaN(product.stock)) {
            return false;
        }
        
        if (product.price < 0 || product.stock < 0) {
            return false;
        }
        
        return true;
    }
    
    // Validate settings data
    function validateSettings(settings) {
        if (isNaN(settings.lowStockThreshold) || settings.lowStockThreshold < 0) {
            return false;
        }
        
        return true;
    }
    
    // Public API
    return {
        formatCurrency,
        formatPercentage,
        generateId,
        validateProduct,
        validateSettings
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
} else {
    window.Utils = Utils;
}