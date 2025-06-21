import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [scriptContent, setScriptContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [openseesStatus, setOpenseesStatus] = useState(null);

  // Verificar el estado de la API al cargar
  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await axios.get('/health');
      setApiStatus(response.data);
      setOpenseesStatus(response.data.opensees_available);
    } catch (error) {
      setApiStatus({ status: 'error', message: 'No se pudo conectar con la API' });
      setOpenseesStatus(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Leer el contenido del archivo
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScriptContent(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const runOpenseesFile = async () => {
    if (!selectedFile) {
      alert('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await axios.post('/run-opensees/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult(response.data);
    } catch (error) {
      setResult({
        success: false,
        stderr: error.response?.data?.detail || error.message,
        stdout: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const runOpenseesScript = async () => {
    if (!scriptContent.trim()) {
      alert('Por favor ingresa un script de OpenSees');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post('/run-opensees-script/', {
        script_content: scriptContent
      });

      setResult(response.data);
    } catch (error) {
      setResult({
        success: false,
        stderr: error.response?.data?.detail || error.message,
        stdout: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setScriptContent('');
    setSelectedFile(null);
  };

  return (
    <div className="App">
      <div className="header">
        <h1>OpenSees Web Application</h1>
        <p>Ejecuta scripts de OpenSees desde tu navegador</p>
      </div>

      <div className="container">
        {/* Estado del sistema */}
        <div className="card">
          <h2>Estado del Sistema</h2>
          <div>
            <p><strong>API Backend:</strong> 
              <span className={apiStatus?.status === 'healthy' ? 'success' : 'error'}>
                {apiStatus?.status === 'healthy' ? ' ✅ Conectado' : ' ❌ No disponible'}
              </span>
            </p>
            <p><strong>OpenSees:</strong> 
              <span className={openseesStatus ? 'success' : 'error'}>
                {openseesStatus ? ' ✅ Disponible' : ' ❌ No disponible'}
              </span>
            </p>
            {openseesStatus && apiStatus?.opensees_version && (
              <p><strong>Versión OpenSees:</strong> {apiStatus.opensees_version}</p>
            )}
          </div>
        </div>

        {/* Subir archivo */}
        <div className="card">
          <h2>Subir Archivo de OpenSees</h2>
          <div className="file-input">
            <input
              type="file"
              accept=".tcl,.txt"
              onChange={handleFileChange}
            />
            <p><small>Formatos soportados: .tcl, .txt</small></p>
          </div>
          <button 
            className="button" 
            onClick={runOpenseesFile}
            disabled={!selectedFile || loading}
          >
            {loading ? 'Ejecutando...' : 'Ejecutar Archivo'}
          </button>
        </div>

        {/* Editor de script */}
        <div className="card">
          <h2>Editor de Script</h2>
          <textarea
            className="textarea"
            value={scriptContent}
            onChange={(e) => setScriptContent(e.target.value)}
            placeholder="Ingresa tu script de OpenSees aquí..."
          />
          <div>
            <button 
              className="button" 
              onClick={runOpenseesScript}
              disabled={!scriptContent.trim() || loading}
            >
              {loading ? 'Ejecutando...' : 'Ejecutar Script'}
            </button>
            <button 
              className="button" 
              onClick={clearResults}
              style={{ backgroundColor: '#e74c3c' }}
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Resultados */}
        {result && (
          <div className="card">
            <h2>Resultados</h2>
            <div className={`result ${result.success ? 'success' : 'error'}`}>
              <strong>Estado:</strong> {result.success ? 'Éxito' : 'Error'}
              {result.return_code !== undefined && (
                <><br /><strong>Código de retorno:</strong> {result.return_code}</>
              )}
              {result.filename && (
                <><br /><strong>Archivo:</strong> {result.filename}</>
              )}
              {result.stdout && (
                <><br /><br /><strong>Salida estándar:</strong><br />{result.stdout}</>
              )}
              {result.stderr && (
                <><br /><br /><strong>Errores:</strong><br />{result.stderr}</>
              )}
            </div>
          </div>
        )}

        {/* Ejemplo de script */}
        <div className="card">
          <h2>Ejemplo de Script</h2>
          <p>Aquí tienes un ejemplo básico de script de OpenSees:</p>
          <pre style={{ 
            background: '#f8f9fa', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
{`# Ejemplo básico de OpenSees
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
print node 3 4`}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App; 