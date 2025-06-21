# OpenSees Web Application

Una aplicación web completa para ejecutar scripts de OpenSees desde el navegador. Esta aplicación combina un backend en Python (FastAPI) con un frontend en React para proporcionar una interfaz moderna y fácil de usar para análisis estructural con OpenSees.

## 🏗️ Arquitectura

- **Backend**: Python + FastAPI
- **Frontend**: React + Axios
- **Motor de análisis**: OpenSees

## 📁 Estructura del Proyecto

```
00_demo/
├── backend/
│   ├── main.py              # API FastAPI principal
│   ├── requirements.txt     # Dependencias de Python
│   ├── venv/               # Entorno virtual
│   └── README.md           # Documentación del backend
├── frontend/
│   ├── public/
│   │   └── index.html      # Archivo HTML principal
│   ├── src/
│   │   ├── App.js          # Componente principal de React
│   │   ├── index.js        # Punto de entrada
│   │   └── index.css       # Estilos
│   ├── package.json        # Dependencias de Node.js
│   └── README.md           # Documentación del frontend
└── README.md               # Este archivo
```

## 🚀 Instalación y Configuración

### Prerrequisitos

1. **Python 3.8+** instalado y configurado
2. **Node.js 14+** instalado
3. **OpenSees** instalado y disponible en el PATH del sistema

### Configuración del Backend

1. Navega al directorio backend:
   ```bash
   cd backend
   ```

2. Activa el entorno virtual:
   ```bash
   # Windows
   .\venv\Scripts\Activate.ps1
   
   # Linux/Mac
   source venv/bin/activate
   ```

3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Ejecuta el servidor backend:
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

El backend estará disponible en `http://localhost:8000`

### Configuración del Frontend

1. Navega al directorio frontend:
   ```bash
   cd frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Ejecuta la aplicación React:
   ```bash
   npm start
   ```

El frontend estará disponible en `http://localhost:3000`

## 🎯 Características

### Backend (FastAPI)
- ✅ API REST para ejecutar OpenSees
- ✅ Soporte para archivos .tcl y .txt
- ✅ Ejecución de scripts directos
- ✅ Manejo de errores y timeouts
- ✅ Documentación automática (Swagger/ReDoc)
- ✅ Verificación de estado del sistema

### Frontend (React)
- ✅ Interfaz moderna y responsiva
- ✅ Subida de archivos drag & drop
- ✅ Editor de script integrado
- ✅ Visualización de resultados en tiempo real
- ✅ Estado del sistema en vivo
- ✅ Ejemplo de script incluido

## 📖 Uso

1. **Abrir la aplicación**: Navega a `http://localhost:3000`
2. **Verificar estado**: La aplicación mostrará si el backend y OpenSees están disponibles
3. **Ejecutar script**: Puedes:
   - Subir un archivo .tcl o .txt
   - Escribir un script directamente en el editor
4. **Ver resultados**: Los resultados se mostrarán en tiempo real

## 🔧 Endpoints de la API

- `GET /`: Verificar que la API está funcionando
- `GET /health`: Estado del sistema y OpenSees
- `POST /run-opensees/`: Ejecutar archivo de entrada
- `POST /run-opensees-script/`: Ejecutar script directo

## 📚 Documentación de la API

Una vez que el backend esté ejecutándose, puedes acceder a:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 🛠️ Desarrollo

### Ejecutar en modo desarrollo

**Backend:**
```bash
cd backend
.\venv\Scripts\Activate.ps1  # Windows
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm start
```

### Build para producción

**Frontend:**
```bash
cd frontend
npm run build
```

## 🔍 Solución de Problemas

### OpenSees no encontrado
- Asegúrate de que OpenSees esté instalado
- Verifica que esté en el PATH del sistema
- En Windows, prueba ejecutar `OpenSees --version` en la terminal

### Error de conexión entre frontend y backend
- Verifica que ambos servidores estén ejecutándose
- Backend en puerto 8000, frontend en puerto 3000
- Revisa la configuración de CORS en `main.py`

### Problemas con dependencias
- Reinstala las dependencias: `pip install -r requirements.txt`
- Para el frontend: `npm install`

## 📝 Ejemplo de Script

La aplicación incluye un ejemplo básico de script de OpenSees que puedes usar como punto de partida:

```tcl
# Ejemplo básico de OpenSees
wipe
model basic -ndm 2 -ndf 3

# Crear nodos
node 1 0.0 0.0
node 2 10.0 0.0
node 3 10.0 10.0
node 4 0.0 10.0

# Definir material
uniaxialMaterial Elastic 1 30000.0

# Crear elementos
geomTransf Linear 1
element elasticBeamColumn 1 1 2 100.0 30000.0 1000.0 1
element elasticBeamColumn 2 2 3 100.0 30000.0 1000.0 1
element elasticBeamColumn 3 3 4 100.0 30000.0 1000.0 1
element elasticBeamColumn 4 4 1 100.0 30000.0 1000.0 1

# Aplicar restricciones
fix 1 1 1 1
fix 2 0 1 1

# Aplicar carga
pattern Plain 1 Linear {
    load 3 0.0 -1000.0 0.0
    load 4 0.0 -1000.0 0.0
}

# Análisis
system BandSPD
numberer RCM
constraints Plain
integrator LoadControl 1.0
algorithm Linear
analysis Static
analyze 1

# Imprimir resultados
puts "Análisis completado"
print node 3 4
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👨‍💻 Autor

Desarrollado para análisis estructural con OpenSees. 