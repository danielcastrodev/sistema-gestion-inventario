// Inventory management module
const InventoryManager = (function() {
    'use strict';
    
    // Current sort state
    let currentSort = { column: 'name', direction: 'asc' };
    
    // Load and display products in the inventory table
    async function loadProducts(sortColumn = null, sortDirection = null) {
        // Update sort state if new sort is requested
        if (sortColumn !== null) {
            if (currentSort.column === sortColumn) {
                // Toggle direction if same column
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                // New column, default to ascending
                currentSort.column = sortColumn;
                currentSort.direction = 'asc';
            }
        }
        
        try {
            const products = await Storage.getProducts();
            const tableBody = document.getElementById(CONFIG.PRODUCTS_TABLE_ID);
            
            if (products.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="5" class="text-center">No hay productos en el inventario</td>
                    </tr>
                `;
                return;
            }
            
            // Sort products based on current sort state
            const sortedProducts = [...products].sort((a, b) => {
                let aVal = a[currentSort.column];
                let bVal = b[currentSort.column];
                
                // Handle numeric comparisons
                if (currentSort.column === 'price' || currentSort.column === 'stock') {
                    aVal = parseFloat(aVal);
                    bVal = parseFloat(bVal);
                } else {
                    // For strings, convert to lowercase for case-insensitive comparison
                    aVal = aVal.toString().toLowerCase();
                    bVal = bVal.toString().toLowerCase();
                }
                
                if (aVal < bVal) {
                    return currentSort.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return currentSort.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
            
            tableBody.innerHTML = '';
            sortedProducts.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${Utils.formatCurrency(product.price)}</td>
                    <td>${product.stock}</td>
                    <td>
                        <span class="action-btn edit-btn" onclick="InventoryManager.editProduct('${product.id}')">
                            <i class="bi bi-pencil"></i>
                        </span>
                        <span class="action-btn delete-btn" onclick="InventoryManager.deleteProduct('${product.id}')">
                            <i class="bi bi-trash"></i>
                        </span>
                    </td>
                `;
                tableBody.appendChild(row);
            });
            
            // Update header with sort indicators
            updateTableHeader();
        } catch (error) {
            console.error('Error loading products:', error);
            const tableBody = document.getElementById(CONFIG.PRODUCTS_TABLE_ID);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center text-danger">Error al cargar productos: ${error.message}</td>
                </tr>
            `;
        }
    }
    
    // Update table header with sort indicators
    function updateTableHeader() {
        try {
            const tableElement = document.getElementById(CONFIG.PRODUCTS_TABLE_ID);
            if (!tableElement) {
                console.warn('No se encontró la tabla de productos');
                return;
            }
            
            const headers = tableElement.querySelectorAll('thead th');
            const sortIcons = {
                'asc': '↑',
                'desc': '↓'
            };
            
            // Check if headers exist before trying to modify them
            if (!headers || headers.length === 0) {
                console.warn('No se encontraron encabezados de tabla para actualizar');
                return;
            }
            
            // Clear previous sort indicators
            headers.forEach(header => {
                if (header && typeof header.textContent === 'string') {
                    const text = header.textContent.replace(/[↑↓]/g, '').trim();
                    header.textContent = text;
                }
            });
            
            // Add current sort indicator
            if (currentSort.column === 'name' && headers[0]) {
                headers[0].textContent = (headers[0].textContent || '') + ` ${sortIcons[currentSort.direction]}`;
            }
            if (currentSort.column === 'category' && headers[1]) {
                headers[1].textContent = (headers[1].textContent || '') + ` ${sortIcons[currentSort.direction]}`;
            }
            if (currentSort.column === 'price' && headers[2]) {
                headers[2].textContent = (headers[2].textContent || '') + ` ${sortIcons[currentSort.direction]}`;
            }
            if (currentSort.column === 'stock' && headers[3]) {
                headers[3].textContent = (headers[3].textContent || '') + ` ${sortIcons[currentSort.direction]}`;
            }
        } catch (error) {
            console.error('Error actualizando encabezados de tabla:', error);
        }
    }
    
    // Save a product (add or update)
    async function saveProduct() {
        const id = document.getElementById(CONFIG.PRODUCT_ID_INPUT).value;
        const name = document.getElementById(CONFIG.PRODUCT_NAME_INPUT).value;
        const category = document.getElementById(CONFIG.PRODUCT_CATEGORY_INPUT).value;
        const price = document.getElementById(CONFIG.PRODUCT_PRICE_INPUT).value;
        const stock = document.getElementById(CONFIG.PRODUCT_STOCK_INPUT).value;
        const lowStock = document.getElementById(CONFIG.PRODUCT_LOW_STOCK_INPUT).value || CONFIG.DEFAULT_LOW_STOCK_THRESHOLD;
        
        if (!name || !category || !price || !stock) {
            alert('Por favor complete todos los campos requeridos');
            return;
        }
        
        const product = {
            id: id || null, // Use string ID for Firestore, null for new products
            name,
            category,
            price: parseFloat(price),
            stock: parseInt(stock),
            lowStock: parseInt(lowStock) || CONFIG.DEFAULT_LOW_STOCK_THRESHOLD
        };
        
        // Validate product data
        if (!Utils.validateProduct(product)) {
            alert('Por favor ingrese datos válidos para el producto');
            return;
        }
        
        try {
            const success = await Storage.saveProduct(product);
            
            if (success) {
                // Reset form and close modal
                document.getElementById(CONFIG.PRODUCT_FORM_ID).reset();
                document.getElementById(CONFIG.PRODUCT_ID_INPUT).value = '';
                const modal = bootstrap.Modal.getInstance(document.getElementById(CONFIG.PRODUCT_MODAL_ID));
                if (modal) {
                    modal.hide();
                }
                
                // Reload products
                await loadProducts();
                
                // Update dashboard if we're on that page
                if (document.getElementById(CONFIG.TOTAL_PRODUCTS_ID) && window.DashboardRenderer) {
                    await DashboardRenderer.loadDashboardData();
                }
            } else {
                alert('Error al guardar el producto');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            alert('Error al guardar el producto: ' + error.message);
        }
    }
    
    // Edit a product
    async function editProduct(id) {
        try {
            const products = await Storage.getProducts();
            const product = products.find(p => p.id === id);
            
            if (product) {
                document.getElementById(CONFIG.PRODUCT_ID_INPUT).value = product.id;
                document.getElementById(CONFIG.PRODUCT_NAME_INPUT).value = product.name;
                document.getElementById(CONFIG.PRODUCT_CATEGORY_INPUT).value = product.category;
                document.getElementById(CONFIG.PRODUCT_PRICE_INPUT).value = product.price;
                document.getElementById(CONFIG.PRODUCT_STOCK_INPUT).value = product.stock;
                document.getElementById(CONFIG.PRODUCT_LOW_STOCK_INPUT).value = product.lowStock || CONFIG.DEFAULT_LOW_STOCK_THRESHOLD;
                
                // Update modal title
                document.getElementById('productModalLabel').textContent = 'Editar Producto';
                
                // Show modal
                const modal = new bootstrap.Modal(document.getElementById(CONFIG.PRODUCT_MODAL_ID));
                modal.show();
            }
        } catch (error) {
            console.error('Error loading product for edit:', error);
            alert('Error al cargar el producto para editar');
        }
    }
    
    // Delete a product
    async function deleteProduct(id) {
        try {
            const products = await Storage.getProducts();
            const product = products.find(p => p.id === id);
            
            if (product) {
                // Create a prompt to ask how many units to remove
                const unitsToRemove = prompt(`¿Cuántas unidades de "${product.name}" desea eliminar? (Stock actual: ${product.stock})`, "1");
                
                if (unitsToRemove === null) {
                    // User cancelled
                    return;
                }
                
                const units = parseInt(unitsToRemove);
                
                if (isNaN(units) || units <= 0) {
                    alert("Por favor ingrese un número válido mayor que 0");
                    return;
                }
                
                if (units > product.stock) {
                    alert(`No puede eliminar más unidades de las disponibles. Stock actual: ${product.stock}`);
                    return;
                }
                
                if (units === product.stock) {
                    // Remove the entire product
                    if (confirm(`¿Está seguro de que desea eliminar completamente el producto "${product.name}"?`)) {
                        const success = await Storage.deleteProduct(id);
                        if (success) {
                            await loadProducts();
                            
                            // Update dashboard if we're on that page
                            if (document.getElementById(CONFIG.TOTAL_PRODUCTS_ID) && window.DashboardRenderer) {
                                await DashboardRenderer.loadDashboardData();
                            }
                        } else {
                            alert('Error al eliminar el producto');
                        }
                    }
                } else {
                    // Reduce the stock
                    product.stock -= units;
                    const success = await Storage.saveProduct(product);
                    if (success) {
                        alert(`Se han eliminado ${units} unidades de "${product.name}". Stock restante: ${product.stock}`);
                        await loadProducts();
                        
                        // Update dashboard if we're on that page
                        if (document.getElementById(CONFIG.TOTAL_PRODUCTS_ID) && window.DashboardRenderer) {
                            await DashboardRenderer.loadDashboardData();
                        }
                    } else {
                        alert('Error al actualizar el stock');
                    }
                }
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error al eliminar el producto');
        }
    }
    
    // Initialize with sample data if empty
    async function initializeSampleData() {
        try {
            await Storage.initializeSampleData();
        } catch (error) {
            console.error('Error initializing sample data:', error);
        }
    }
    
    // Public API
    return {
        loadProducts,
        saveProduct,
        editProduct,
        deleteProduct,
        initializeSampleData,
        updateTableHeader // Exposed for testing
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InventoryManager;
} else {
    window.InventoryManager = InventoryManager;
}