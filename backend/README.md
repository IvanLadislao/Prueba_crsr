# OpenSees Web API Backend

Este es el backend de la aplicación web para ejecutar OpenSees. Utiliza FastAPI para proporcionar una API REST que permite ejecutar scripts de OpenSees desde una interfaz web.

## Instalación

1. Asegúrate de tener Python 3.8+ instalado
2. Crea un entorno virtual:
   ```bash
   python -m venv venv
   ```
3. Activa el entorno virtual:
   - Windows: `.\venv\Scripts\Activate.ps1`
   - Linux/Mac: `source venv/bin/activate`
4. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

## Ejecución

Para ejecutar el servidor de desarrollo:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

O simplemente:

```bash
python main.py
```

El servidor estará disponible en `http://localhost:8000`

## Endpoints

- `GET /`: Verificar que la API está funcionando
- `GET /health`: Verificar el estado de la API y OpenSees
- `POST /run-opensees/`: Ejecutar un archivo de entrada de OpenSees
- `POST /run-opensees-script/`: Ejecutar un script de OpenSees directamente

## Documentación de la API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación automática en:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Requisitos

- OpenSees debe estar instalado y disponible en el PATH del sistema
- Python 3.8+
- Las dependencias listadas en `requirements.txt` 