# Sistema de Inventario

Este proyecto es un sistema de gestión de inventario basado en web que utiliza Firebase Firestore como backend.

## Características principales

- Gestión completa de productos (agregar, editar, eliminar)
- Seguimiento de stock con alertas de bajo stock
- Dashboard con estadísticas del inventario
- Configuración personalizable
- Almacenamiento en la nube con Firebase Firestore
- Fallback a localStorage cuando no hay conexión

## Tecnologías utilizadas

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 para la interfaz
- Firebase Firestore para almacenamiento de datos
- Firebase Hosting para despliegue

## Estructura del proyecto

```
public/
├── index.html         # Página principal (Dashboard)
├── inventory.html     # Gestión de inventario
├── settings.html      # Configuración
├── css/
│   └── main.css       # Estilos personalizados
└── js/
    ├── app.js         # Controlador principal
    ├── core/
    │   ├── config.js  # Configuración de la aplicación
    │   ├── storage.js # Manejo de almacenamiento (Firestore/localStorage)
    │   ├── firestore.js # Servicio de Firestore
    │   └── utils.js   # Funciones de utilidad
    ├── modules/
    │   ├── dashboardRenderer.js # Renderizado del dashboard
    │   ├── inventoryManager.js  # Gestión de inventario
    │   └── settingsManager.js   # Gestión de configuración
    └── components/    # Componentes reutilizables (vacío por ahora)
```

## Configuración de Firebase

1. Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Firestore Database
3. Registrar una aplicación web
4. Actualizar la configuración de Firebase en los archivos HTML:
   - `public/index.html`
   - `public/inventory.html`
   - `public/settings.html`

## Despliegue

### Con Firebase CLI

1. Instalar Firebase CLI: `npm install -g firebase-tools`
2. Iniciar sesión: `firebase login`
3. Desplegar: `firebase deploy`

## Desarrollo local

Simplemente abre `public/index.html` en tu navegador o usa un servidor local como:

```bash
# Con Python 3
python -m http.server 8000

# Con Node.js (si tienes http-server instalado)
npx http-server public
```

## Licencia

MIT