# Sistema de Inventario

Sistema de gestión de inventario basado en web con Firebase como backend.
Puedes visitarlo en https://constructora-pyme.web.app/
con una base de datos en tiempo real

## Características

- Gestión completa de productos (agregar, editar, eliminar)
- Seguimiento de stock con alertas de bajo stock
- Dashboard con estadísticas del inventario
- Configuración personalizable
- Almacenamiento en la nube con Firebase Firestore

## Tecnologías

- HTML5, CSS3, JavaScript
- Firebase Firestore para almacenamiento de datos
- Firebase Hosting para despliegue

## Estructura del Proyecto

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
## Licencia

MIT
