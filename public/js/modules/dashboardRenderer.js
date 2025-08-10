// Dashboard rendering module
const DashboardRenderer = (function() {
    'use strict';
    
    // Load and display dashboard data
    async function loadDashboardData() {
        try {
            // Show loading state
            document.getElementById(CONFIG.TOTAL_PRODUCTS_ID).textContent = '...';
            document.getElementById(CONFIG.TOTAL_VALUE_ID).textContent = '...';
            document.getElementById(CONFIG.LOW_STOCK_COUNT_ID).textContent = '...';
            
            const products = await Storage.getProducts();
            
            // Total products
            document.getElementById(CONFIG.TOTAL_PRODUCTS_ID).textContent = products.length;
            
            // Total value
            const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
            document.getElementById(CONFIG.TOTAL_VALUE_ID).textContent = `${Utils.formatCurrency(totalValue)} CLP`;
            
            // Low stock (using individual thresholds)
            const lowStockProducts = products.filter(product => {
                const threshold = product.lowStock || CONFIG.DEFAULT_LOW_STOCK_THRESHOLD;
                return product.stock < threshold;
            });
            document.getElementById(CONFIG.LOW_STOCK_COUNT_ID).textContent = lowStockProducts.length;
            
            // Recent products (last 5)
            const recentProducts = products.slice(-5);
            const recentProductsTable = document.getElementById(CONFIG.RECENT_PRODUCTS_ID);
            
            if (recentProducts.length === 0) {
                recentProductsTable.innerHTML = `
                    <tr>
                        <td colspan="4" class="text-center">No hay productos en el inventario</td>
                    </tr>
                `;
            } else {
                recentProductsTable.innerHTML = '';
                recentProducts.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${Utils.formatCurrency(product.price)}</td>
                        <td>${product.stock}</td>
                    `;
                    recentProductsTable.appendChild(row);
                });
            }
            
            // Low stock products (all)
            const lowStockProductsTable = document.getElementById(CONFIG.LOW_STOCK_PRODUCTS_ID);
            
            if (lowStockProducts.length === 0) {
                lowStockProductsTable.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">No hay productos con bajo stock</td>
                    </tr>
                `;
            } else {
                lowStockProductsTable.innerHTML = '';
                lowStockProducts.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${product.name}</td>
                        <td>${product.category}</td>
                        <td>${Utils.formatCurrency(product.price)}</td>
                        <td>${product.stock}</td>
                        <td>${product.lowStock || CONFIG.DEFAULT_LOW_STOCK_THRESHOLD}</td>
                    `;
                    lowStockProductsTable.appendChild(row);
                });
            }
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            // Show error state for dashboard stats
            document.getElementById(CONFIG.TOTAL_PRODUCTS_ID).textContent = '--';
            document.getElementById(CONFIG.TOTAL_VALUE_ID).textContent = 'Error';
            document.getElementById(CONFIG.LOW_STOCK_COUNT_ID).textContent = '--';
            
            // Show error in tables
            const errorMessage = `
                <tr>
                    <td colspan="5" class="text-center text-danger">Error al cargar datos: ${error.message}</td>
                </tr>
            `;
            
            const recentProductsTable = document.getElementById(CONFIG.RECENT_PRODUCTS_ID);
            const lowStockProductsTable = document.getElementById(CONFIG.LOW_STOCK_PRODUCTS_ID);
            
            if (recentProductsTable) recentProductsTable.innerHTML = errorMessage;
            if (lowStockProductsTable) lowStockProductsTable.innerHTML = errorMessage;
        }
    }
    
    // Public API
    return {
        loadDashboardData
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardRenderer;
} else {
    window.DashboardRenderer = DashboardRenderer;
}