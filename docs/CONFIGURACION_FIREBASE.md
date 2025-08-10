# Configuración de Firebase para el Sistema de Inventario

Este documento explica cómo configurar Firebase para que el sistema de inventario funcione con Firestore.

## Pasos para configurar Firebase

### 1. Crear un proyecto de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en "Crear proyecto" o "Add project"
3. Ingresa un nombre para tu proyecto (ej: "sistema-inventario")
4. Continúa siguiendo las instrucciones para crear el proyecto

### 2. Habilitar Firestore

1. En la consola de Firebase, ve a "Firestore Database"
2. Haz clic en "Crear base de datos"
3. Selecciona "Comenzar en modo de prueba" (para desarrollo)
4. Elige una ubicación para tu base de datos (recomendado: nam5 para América)

### 3. Obtener la configuración del proyecto

1. En la consola de Firebase, ve a "Configuración del proyecto" (ícono de engranaje)
2. Desplázate hacia abajo hasta "Tus aplicaciones"
3. Haz clic en "Agregar aplicación" y selecciona el ícono web (</>)
4. Ingresa un nombre para tu aplicación
5. Copia la configuración que aparece, se verá similar a esto:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyA...",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### 4. Actualizar los archivos HTML

Necesitas reemplazar la configuración de Firebase en estos archivos:
- `public/index.html`
- `public/inventory.html`
- `public/settings.html`

En cada archivo, busca esta sección:

```javascript
// Tu configuración de Firebase - DEBES reemplazar estos valores con los de tu proyecto
const firebaseConfig = {
    apiKey: "tu-api-key",
    authDomain: "tu-project-id.firebaseapp.com",
    projectId: "tu-project-id",
    storageBucket: "tu-project-id.appspot.com",
    messagingSenderId: "123456789",
    appId: "tu-app-id"
};
```

Y reemplaza los valores con los de tu proyecto.

### 5. Configurar las reglas de Firestore

Las reglas ya están configuradas en el archivo `firestore.rules`. Puedes aplicarlas de dos maneras:

#### Opción A: Usar Firebase CLI
1. Instala Firebase CLI: `npm install -g firebase-tools`
2. Inicia sesión: `firebase login`
3. Inicializa el proyecto: `firebase init` (selecciona Firestore)
4. Despliega las reglas: `firebase deploy --only firestore:rules`

#### Opción B: Copiar manualmente
1. Ve a "Firestore Database" > "Reglas" en la consola de Firebase
2. Copia el contenido del archivo `firestore.rules` y pégalo en el editor
3. Haz clic en "Publicar"

### 6. Probar la configuración

1. Abre el archivo `public/index.html` en tu navegador
2. Abre las herramientas de desarrollador (F12)
3. Verifica que no hay errores en la consola
4. Si todo está bien, deberías ver los datos de muestra cargarse

## Estructura de datos en Firestore

### Colección: `products`
Cada documento representa un producto con los siguientes campos:
- `name`: string
- `category`: string
- `price`: number
- `stock`: number
- `lowStock`: number
- `createdAt`: timestamp
- `updatedAt`: timestamp

### Colección: `settings`
Documento único con ID `general` que contiene:
- `companyName`: string
- `lowStockThreshold`: number
- `currency`: string
- `updatedAt`: timestamp

## Modo de fallback

Si Firebase no está disponible, el sistema automáticamente usa localStorage como respaldo. Esto permite que la aplicación funcione incluso sin conexión a internet.

## Solución de problemas

### Error de permisos
Si ves errores de permisos, verifica que las reglas de Firestore estén configuradas correctamente.

### Error de configuración
Si ves errores de configuración, verifica que hayas reemplazado todos los valores de `firebaseConfig` en los archivos HTML.

### Error de red
Si ves errores de red, verifica tu conexión a internet y que el proyecto de Firebase esté activo.
