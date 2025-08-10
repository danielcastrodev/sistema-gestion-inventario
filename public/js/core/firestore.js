// Firestore service module for handling database operations
const FirestoreService = (function() {
    'use strict';
    
    // Import Firestore functions
    let db;
    let collection, addDoc, updateDoc, deleteDoc, getDocs, doc, getDoc, setDoc, query, orderBy, where;
    
    // Initialize Firestore imports and database reference
    async function initializeFirestore() {
        if (db) return; // Already initialized
        
        try {
            // Wait for Firebase to be loaded (reduced wait time)
            let retries = 0;
            while (!window.db && retries < 10) { // Reducido de 50 a 10 intentos
                await new Promise(resolve => setTimeout(resolve, 50)); // Reducido de 100ms a 50ms
                retries++;
            }
            
            if (!window.db) {
                throw new Error('Firebase not initialized after waiting');
            }
            
            db = window.db;
            
            // Import Firestore functions dynamically (with error handling)
            try {
                const firestoreModule = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
                collection = firestoreModule.collection;
                addDoc = firestoreModule.addDoc;
                updateDoc = firestoreModule.updateDoc;
                deleteDoc = firestoreModule.deleteDoc;
                getDocs = firestoreModule.getDocs;
                doc = firestoreModule.doc;
                getDoc = firestoreModule.getDoc;
                setDoc = firestoreModule.setDoc;
                query = firestoreModule.query;
                orderBy = firestoreModule.orderBy;
                where = firestoreModule.where;
            } catch (importError) {
                console.error('Error importing Firestore modules:', importError);
                // Try to use global Firestore functions if available
                if (window.firebase && window.firebase.firestore) {
                    const firestore = window.firebase.firestore;
                    collection = firestore.collection;
                    addDoc = firestore.addDoc || function(ref, data) { return ref.add(data); };
                    updateDoc = firestore.updateDoc || function(ref, data) { return ref.update(data); };
                    deleteDoc = firestore.deleteDoc || function(ref) { return ref.delete(); };
                    getDocs = firestore.getDocs || function(ref) { return ref.get(); };
                    doc = firestore.doc;
                    getDoc = firestore.getDoc || function(ref) { return ref.get(); };
                    setDoc = firestore.setDoc || function(ref, data) { return ref.set(data); };
                    query = firestore.query || function(ref) { return ref; };
                    orderBy = firestore.orderBy;
                    where = firestore.where;
                } else {
                    throw new Error('Could not import Firestore modules');
                }
            }
            
        } catch (error) {
            console.error('Error initializing Firestore:', error);
            throw new Error('Failed to initialize Firestore: ' + error.message);
        }
    }
    
    // Get all products from Firestore
    async function getProducts() {
        try {
            await initializeFirestore();
            const productsRef = collection(db, 'products');
            
            // Add timeout to prevent hanging
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout al obtener productos')), 5000)
            );
            
            const snapshotPromise = getDocs(productsRef);
            const snapshot = await Promise.race([snapshotPromise, timeoutPromise]);
            
            const products = [];
            snapshot.forEach(doc => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            
            return products;
        } catch (error) {
            console.error('Error getting products from Firestore:', error);
            // Mostrar mensaje más específico al usuario
            throw new Error('Error al obtener productos: ' + error.message);
        }
    }
    
    // Save a single product to Firestore
    async function saveProduct(product) {
        try {
            await initializeFirestore();
            const productsRef = collection(db, 'products');
            
            if (product.id && typeof product.id === 'string') {
                // Update existing product
                const productDoc = doc(db, 'products', product.id);
                await updateDoc(productDoc, {
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    stock: product.stock,
                    lowStock: product.lowStock || CONFIG.DEFAULT_LOW_STOCK_THRESHOLD,
                    updatedAt: new Date()
                });
            } else {
                // Add new product
                const docRef = await addDoc(productsRef, {
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    stock: product.stock,
                    lowStock: product.lowStock || CONFIG.DEFAULT_LOW_STOCK_THRESHOLD,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                product.id = docRef.id;
            }
            
            return true;
        } catch (error) {
            console.error('Error saving product to Firestore:', error);
            // Mostrar mensaje más específico al usuario
            throw new Error('Error al guardar producto: ' + error.message);
        }
    }
    
    // Save multiple products to Firestore (for import functionality)
    async function saveProducts(products) {
        try {
            await initializeFirestore();
            
            // Clear existing products first
            await clearProducts();
            
            // Add each product
            const promises = products.map(product => saveProduct(product));
            await Promise.all(promises);
            
            return true;
        } catch (error) {
            console.error('Error saving products to Firestore:', error);
            return false;
        }
    }
    
    // Delete a product from Firestore
    async function deleteProduct(productId) {
        try {
            await initializeFirestore();
            const productDoc = doc(db, 'products', productId);
            await deleteDoc(productDoc);
            return true;
        } catch (error) {
            console.error('Error deleting product from Firestore:', error);
            return false;
        }
    }
    
    // Clear all products from Firestore
    async function clearProducts() {
        try {
            await initializeFirestore();
            const productsRef = collection(db, 'products');
            const snapshot = await getDocs(productsRef);
            
            const deletePromises = [];
            snapshot.forEach(docSnapshot => {
                deletePromises.push(deleteDoc(docSnapshot.ref));
            });
            
            await Promise.all(deletePromises);
            return true;
        } catch (error) {
            console.error('Error clearing products from Firestore:', error);
            return false;
        }
    }
    
    // Get settings from Firestore
    async function getSettings() {
        try {
            await initializeFirestore();
            const settingsDoc = doc(db, 'settings', 'general');
            const docSnap = await getDoc(settingsDoc);
            
            if (docSnap.exists()) {
                return docSnap.data();
            } else {
                // Return default settings if document doesn't exist
                return { 
                    currency: CONFIG.DEFAULT_CURRENCY,
                    lowStockThreshold: CONFIG.DEFAULT_LOW_STOCK_THRESHOLD,
                    companyName: ''
                };
            }
        } catch (error) {
            console.error('Error getting settings from Firestore:', error);
            return { 
                currency: CONFIG.DEFAULT_CURRENCY,
                lowStockThreshold: CONFIG.DEFAULT_LOW_STOCK_THRESHOLD,
                companyName: ''
            };
        }
    }
    
    // Save settings to Firestore
    async function saveSettings(settings) {
        try {
            await initializeFirestore();
            const settingsDoc = doc(db, 'settings', 'general');
            await setDoc(settingsDoc, {
                ...settings,
                updatedAt: new Date()
            }, { merge: true });
            
            return true;
        } catch (error) {
            console.error('Error saving settings to Firestore:', error);
            return false;
        }
    }
    
    // Initialize sample data if no products exist
    async function initializeSampleData() {
        try {
            const products = await getProducts();
            if (products.length === 0) {
                const sampleProducts = [
                    { name: 'Laptop', category: 'Electrónica', price: 1200000, stock: 15, lowStock: 5 },
                    { name: 'Mouse Inalámbrico', category: 'Accesorios', price: 25990, stock: 50, lowStock: 10 },
                    { name: 'Teclado Mecánico', category: 'Accesorios', price: 89990, stock: 30, lowStock: 8 },
                    { name: 'Monitor 24"', category: 'Electrónica', price: 199990, stock: 20, lowStock: 3 },
                    { name: 'Auriculares Bluetooth', category: 'Electrónica', price: 79990, stock: 25, lowStock: 5 }
                ];
                
                for (const product of sampleProducts) {
                    await saveProduct(product);
                }
            }
        } catch (error) {
            console.error('Error initializing sample data:', error);
        }
    }
    
    // Public API - maintaining compatibility with localStorage Storage module
    return {
        getProducts,
        saveProducts,
        saveProduct,
        deleteProduct,
        clearProducts,
        getSettings,
        saveSettings,
        initializeSampleData,
        initializeFirestore
    };
})();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirestoreService;
} else {
    window.FirestoreService = FirestoreService;
}
