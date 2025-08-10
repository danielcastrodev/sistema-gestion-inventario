// Settings management module
const SettingsManager = (function() {
    'use strict';
    
    // Load and display settings
    async function loadSettings() {
        try {
            const settings = await Storage.getSettings();
            
            document.getElementById(CONFIG.COMPANY_NAME_INPUT).value = settings.companyName || '';
            document.getElementById(CONFIG.LOW_STOCK_THRESHOLD_INPUT).value = settings.lowStockThreshold || CONFIG.DEFAULT_LOW_STOCK_THRESHOLD;
            // Set currency to CLP and disable the dropdown
            document.getElementById(CONFIG.CURRENCY_SELECT).value = CONFIG.DEFAULT_CURRENCY;
            document.getElementById(CONFIG.CURRENCY_SELECT).disabled = true;
            
            // Setup event listeners for data management
            document.getElementById('exportDataBtn').addEventListener('click', exportData);
            document.getElementById('importDataBtn').addEventListener('click', () => {
                document.getElementById('fileInput').click();
            });
            document.getElementById('fileInput').addEventListener('change', importData);
        } catch (error) {
            console.error('Error loading settings:', error);
            alert('Error al cargar la configuración');
        }
    }
    
    // Save settings
    async function saveSettings() {
        try {
            const settings = {
                companyName: document.getElementById(CONFIG.COMPANY_NAME_INPUT).value,
                lowStockThreshold: parseInt(document.getElementById(CONFIG.LOW_STOCK_THRESHOLD_INPUT).value) || CONFIG.DEFAULT_LOW_STOCK_THRESHOLD,
                currency: CONFIG.DEFAULT_CURRENCY // Always CLP
            };
            
            // Validate settings data
            if (!Utils.validateSettings(settings)) {
                alert('Por favor ingrese un umbral de stock bajo válido');
                return;
            }
            
            const success = await Storage.saveSettings(settings);
            if (success) {
                alert('Configuración guardada correctamente');
            } else {
                alert('Error al guardar la configuración');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error al guardar la configuración');
        }
    }
    
    // Clear all data
    async function clearAllData() {
        if (confirm('¿Está seguro de que desea eliminar todos los productos? Esta acción no se puede deshacer.')) {
            try {
                const success = await Storage.saveProducts([]);
                if (success) {
                    // Reload products if we're on the inventory page
                    if (typeof InventoryManager !== 'undefined' && document.getElementById(CONFIG.PRODUCTS_TABLE_ID)) {
                        await InventoryManager.loadProducts();
                    }
                    alert('Todos los productos han sido eliminados');
                    
                    // Update dashboard if we're on that page
                    if (document.getElementById(CONFIG.TOTAL_PRODUCTS_ID) && window.DashboardRenderer) {
                        await DashboardRenderer.loadDashboardData();
                    }
                } else {
                    alert('Error al limpiar los datos');
                }
            } catch (error) {
                console.error('Error clearing data:', error);
                alert('Error al limpiar los datos');
            }
        }
    }
    
    // Export data
    async function exportData() {
        try {
            const products = await Storage.getProducts();
            const dataStr = JSON.stringify(products, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            
            const exportFileDefaultName = 'inventario-export.json';
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        } catch (error) {
            console.error('Error exporting data:', error);
            alert('Error al exportar los datos');
        }
    }
    
    // Import data
    function importData(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const data = JSON.parse(e.target.result);
                
                // Validate data structure
                if (!Array.isArray(data)) {
                    throw new Error('Formato de datos inválido');
                }
                
                // Confirm import
                if (confirm(`¿Está seguro de que desea importar ${data.length} productos? Esto reemplazará todos los productos actuales.`)) {
                    const success = await Storage.saveProducts(data);
                    if (success) {
                        // Reload products if we're on the inventory page
                        if (typeof InventoryManager !== 'undefined' && document.getElementById(CONFIG.PRODUCTS_TABLE_ID)) {
                            await InventoryManager.loadProducts();
                        }
                        alert('Datos importados correctamente');
                        
                        // Update dashboard if we're on that page
                        if (document.getElementById(CONFIG.TOTAL_PRODUCTS_ID) && window.DashboardRenderer) {
                            await DashboardRenderer.loadDashboardData();
                        }
                    } else {
                        alert('Error al importar los datos');
                    }
                }
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Error al importar datos: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    
    // Public API
    return {
        loadSettings,
        saveSettings,
        clearAllData,
        exportData,
        importData
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SettingsManager;
} else {
    window.SettingsManager = SettingsManager;
}