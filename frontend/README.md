# OpenSees Web Frontend

Este es el frontend de la aplicación web para ejecutar OpenSees. Utiliza React para proporcionar una interfaz de usuario moderna y fácil de usar.

## Instalación

1. Asegúrate de tener Node.js instalado (versión 14 o superior)
2. Instala las dependencias:
   ```bash
   npm install
   ```

## Ejecución

Para ejecutar la aplicación en modo desarrollo:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:3000`

## Características

- **Subir archivos**: Permite subir archivos .tcl o .txt con scripts de OpenSees
- **Editor de script**: Editor de texto integrado para escribir scripts directamente
- **Estado del sistema**: Muestra el estado de la API backend y OpenSees
- **Resultados**: Visualización de la salida y errores de OpenSees
- **Ejemplo incluido**: Script de ejemplo para comenzar

## Estructura del Proyecto

```
frontend/
├── public/
│   └── index.html          # Archivo HTML principal
├── src/
│   ├── App.js              # Componente principal
│   ├── index.js            # Punto de entrada
│   └── index.css           # Estilos globales
└── package.json            # Dependencias y scripts
```

## Configuración

La aplicación está configurada para comunicarse con el backend en `http://localhost:8000`. Si necesitas cambiar esta URL, modifica la propiedad `proxy` en `package.json`.

## Dependencias Principales

- React 18.2.0
- Axios 1.6.0 (para comunicación HTTP)
- React Scripts 5.0.1 (para desarrollo y build) 