// Main application controller
document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    // Initialize the app
    async function init() {
        try {
            // Wait for Firebase to be ready (reduced wait time)
            let retries = 0;
            while (!window.db && retries < 10) { // Reducido de 50 a 10 intentos
                await new Promise(resolve => setTimeout(resolve, 50)); // Reducido de 100ms a 50ms
                retries++;
            }
            
            if (!window.db) {
                console.warn('Firebase no está disponible, usando localStorage como fallback');
                if (window.Storage && Storage.enableLocalStorageFallback) {
                    Storage.enableLocalStorageFallback();
                }
            }
            
            // Initialize sample data if needed (only on inventory page)
            if (document.getElementById(CONFIG.PRODUCTS_TABLE_ID)) {
                await InventoryManager.initializeSampleData();
            }
            
            // Check which page we're on and initialize accordingly
            if (document.getElementById(CONFIG.TOTAL_PRODUCTS_ID)) {
                // Dashboard page
                await DashboardRenderer.loadDashboardData();
            } else if (document.getElementById(CONFIG.PRODUCTS_TABLE_ID)) {
                // Inventory page
                await InventoryManager.loadProducts();
                
                // Setup event listeners for inventory page
                document.getElementById('saveProductBtn').addEventListener('click', InventoryManager.saveProduct);
                
                // Make loadProducts available globally for onclick handlers
                window.loadProducts = InventoryManager.loadProducts;
            } else if (document.getElementById(CONFIG.COMPANY_NAME_INPUT)) {
                // Settings page
                await SettingsManager.loadSettings();
                
                // Setup event listeners for settings page
                document.getElementById('saveSettingsBtn').addEventListener('click', SettingsManager.saveSettings);
                document.getElementById('clearDataBtn').addEventListener('click', SettingsManager.clearAllData);
            }
        } catch (error) {
            console.error('Error initializing app:', error);
            alert('Error al inicializar la aplicación. Por favor, recarga la página.');
        }
    }
    
    // Initialize the application
    init();
});