// Storage module - Now using Firestore instead of localStorage
const Storage = (function() {
    'use strict';
    
    // Flag to check if we should use localStorage as fallback
    let useLocalStorageFallback = false;
    
    // Check if Firestore is available
    function isFirestoreAvailable() {
        return window.FirestoreService && !useLocalStorageFallback;
    }
    
    // Get products - async wrapper for Firestore compatibility
    async function getProducts() {
        if (isFirestoreAvailable()) {
            return await FirestoreService.getProducts();
        } else {
            // Fallback to localStorage
            try {
                const products = localStorage.getItem(CONFIG.PRODUCTS_KEY);
                return products ? JSON.parse(products) : [];
            } catch (error) {
                console.error('Error parsing products from localStorage:', error);
                return [];
            }
        }
    }
    
    // Save products - async wrapper for Firestore compatibility
    async function saveProducts(products) {
        if (isFirestoreAvailable()) {
            return await FirestoreService.saveProducts(products);
        } else {
            // Fallback to localStorage
            try {
                localStorage.setItem(CONFIG.PRODUCTS_KEY, JSON.stringify(products));
                return true;
            } catch (error) {
                console.error('Error saving products to localStorage:', error);
                return false;
            }
        }
    }
    
    // Save single product - new method for Firestore
    async function saveProduct(product) {
        if (isFirestoreAvailable()) {
            return await FirestoreService.saveProduct(product);
        } else {
            // Fallback: get all products, update/add the one, save all
            const products = await getProducts();
            if (product.id) {
                const index = products.findIndex(p => p.id === product.id);
                if (index !== -1) {
                    products[index] = product;
                } else {
                    products.push(product);
                }
            } else {
                product.id = Utils.generateId();
                products.push(product);
            }
            return await saveProducts(products);
        }
    }
    
    // Delete product - new method for Firestore
    async function deleteProduct(productId) {
        if (isFirestoreAvailable()) {
            return await FirestoreService.deleteProduct(productId);
        } else {
            // Fallback: get all products, filter out the one, save remaining
            const products = await getProducts();
            const updatedProducts = products.filter(p => p.id !== productId);
            return await saveProducts(updatedProducts);
        }
    }
    
    // Get settings - async wrapper for Firestore compatibility
    async function getSettings() {
        if (isFirestoreAvailable()) {
            return await FirestoreService.getSettings();
        } else {
            // Fallback to localStorage
            try {
                const settings = localStorage.getItem(CONFIG.SETTINGS_KEY);
                return settings ? JSON.parse(settings) : { 
                    currency: CONFIG.DEFAULT_CURRENCY,
                    lowStockThreshold: CONFIG.DEFAULT_LOW_STOCK_THRESHOLD,
                    companyName: ''
                };
            } catch (error) {
                console.error('Error parsing settings from localStorage:', error);
                return { 
                    currency: CONFIG.DEFAULT_CURRENCY,
                    lowStockThreshold: CONFIG.DEFAULT_LOW_STOCK_THRESHOLD,
                    companyName: ''
                };
            }
        }
    }
    
    // Save settings - async wrapper for Firestore compatibility
    async function saveSettings(settings) {
        if (isFirestoreAvailable()) {
            return await FirestoreService.saveSettings(settings);
        } else {
            // Fallback to localStorage
            try {
                localStorage.setItem(CONFIG.SETTINGS_KEY, JSON.stringify(settings));
                return true;
            } catch (error) {
                console.error('Error saving settings to localStorage:', error);
                return false;
            }
        }
    }
    
    // Initialize with sample data if empty
    async function initializeSampleData() {
        if (isFirestoreAvailable()) {
            return await FirestoreService.initializeSampleData();
        } else {
            // Fallback: check localStorage and add sample data if empty
            const products = await getProducts();
            if (products.length === 0) {
                const sampleProducts = [
                    { id: 1, name: 'Laptop', category: 'Electrónica', price: 1200000, stock: 15, lowStock: 5 },
                    { id: 2, name: 'Mouse Inalámbrico', category: 'Accesorios', price: 25990, stock: 50, lowStock: 10 },
                    { id: 3, name: 'Teclado Mecánico', category: 'Accesorios', price: 89990, stock: 30, lowStock: 8 },
                    { id: 4, name: 'Monitor 24"', category: 'Electrónica', price: 199990, stock: 20, lowStock: 3 },
                    { id: 5, name: 'Auriculares Bluetooth', category: 'Electrónica', price: 79990, stock: 25, lowStock: 5 }
                ];
                
                await saveProducts(sampleProducts);
            }
        }
    }
    
    // Enable localStorage fallback mode
    function enableLocalStorageFallback() {
        useLocalStorageFallback = true;
        console.warn('Using localStorage fallback mode');
    }
    
    // Public API
    return {
        getProducts,
        saveProducts,
        saveProduct,
        deleteProduct,
        getSettings,
        saveSettings,
        initializeSampleData,
        enableLocalStorageFallback
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
} else {
    window.Storage = Storage;
}