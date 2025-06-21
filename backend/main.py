from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import subprocess
import os
import tempfile
from typing import Optional
import json

app = FastAPI(title="OpenSees Web API", version="1.0.0")

# Configurar CORS para permitir comunicación con el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # URL del frontend React
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    """Endpoint de prueba para verificar que la API está funcionando"""
    return {"message": "OpenSees Web API is running!", "status": "success"}

@app.post("/run-opensees/")
async def run_opensees(file: UploadFile = File(...)):
    """
    Ejecuta un archivo de entrada de OpenSees
    """
    try:
        # Verificar que el archivo sea un archivo de texto
        if not file.filename.endswith(('.tcl', '.txt')):
            raise HTTPException(status_code=400, detail="Solo se permiten archivos .tcl o .txt")
        
        # Crear un archivo temporal
        with tempfile.NamedTemporaryFile(mode='w', suffix='.tcl', delete=False) as temp_file:
            content = await file.read()
            temp_file.write(content.decode('utf-8'))
            temp_file_path = temp_file.name
        
        # Ejecutar OpenSees
        try:
            result = subprocess.run(
                ['OpenSees', temp_file_path], 
                capture_output=True, 
                text=True, 
                timeout=60  # Timeout de 60 segundos
            )
            
            # Limpiar archivo temporal
            os.unlink(temp_file_path)
            
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "return_code": result.returncode,
                "filename": file.filename
            }
            
        except subprocess.TimeoutExpired:
            # Limpiar archivo temporal en caso de timeout
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
            raise HTTPException(status_code=408, detail="Timeout: OpenSees tardó demasiado en ejecutarse")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ejecutando OpenSees: {str(e)}")

@app.post("/run-opensees-script/")
async def run_opensees_script(script_content: str):
    """
    Ejecuta un script de OpenSees directamente desde el contenido
    """
    try:
        # Crear un archivo temporal con el script
        with tempfile.NamedTemporaryFile(mode='w', suffix='.tcl', delete=False) as temp_file:
            temp_file.write(script_content)
            temp_file_path = temp_file.name
        
        # Ejecutar OpenSees
        try:
            result = subprocess.run(
                ['OpenSees', temp_file_path], 
                capture_output=True, 
                text=True, 
                timeout=60
            )
            
            # Limpiar archivo temporal
            os.unlink(temp_file_path)
            
            return {
                "success": result.returncode == 0,
                "stdout": result.stdout,
                "stderr": result.stderr,
                "return_code": result.returncode
            }
            
        except subprocess.TimeoutExpired:
            if os.path.exists(temp_file_path):
                os.unlink(temp_file_path)
            raise HTTPException(status_code=408, detail="Timeout: OpenSees tardó demasiado en ejecutarse")
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error ejecutando OpenSees: {str(e)}")

@app.get("/health")
def health_check():
    """Verificar el estado de la API y OpenSees"""
    try:
        # Verificar si OpenSees está disponible
        result = subprocess.run(['OpenSees', '--version'], capture_output=True, text=True)
        opensees_available = result.returncode == 0
    except:
        opensees_available = False
    
    return {
        "status": "healthy",
        "opensees_available": opensees_available,
        "opensees_version": result.stdout if opensees_available else "Not available"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 