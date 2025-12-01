import React, { useState, useEffect } from 'react';
import { conveniosAPI } from '../services/api';
import './Convenios.css';

const Convenios = () => {
  const [convenios, setConvenios] = useState([]);
  const [categorias, setCategorias] = useState({});
  const [loading, setLoading] = useState(true);
  const [convenioExpandido, setConvenioExpandido] = useState(null);

  useEffect(() => {
    cargarConvenios();
  }, []);

  const cargarConvenios = async () => {
    try {
      setLoading(true);
      const res = await conveniosAPI.getAll();
      setConvenios(res.data);

      // Cargar categorías para cada convenio
      const categoriasMap = {};
      for (const convenio of res.data) {
        try {
          const catRes = await conveniosAPI.getCategorias(convenio.id);
          categoriasMap[convenio.id] = catRes.data;
        } catch (error) {
          console.error(`Error cargando categorías para ${convenio.nombre}:`, error);
          categoriasMap[convenio.id] = [];
        }
      }
      setCategorias(categoriasMap);
    } catch (error) {
      console.error('Error cargando convenios:', error);
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        alert('⚠️ Error: El servidor backend no está corriendo.\n\nPor favor:\n1. Abre una terminal\n2. Ejecuta: cd "/Users/nico/Copia Xubio" && npm run dev\n3. Espera a que el servidor inicie\n4. Recarga esta página');
      } else {
        alert('Error al cargar los convenios: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleExpandir = (convenioId) => {
    if (convenioExpandido === convenioId) {
      setConvenioExpandido(null);
    } else {
      setConvenioExpandido(convenioId);
    }
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  };

  if (loading) {
    return (
      <div className="convenios">
        <h1>Convenios Colectivos</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="convenios">
      <div className="convenios-header">
        <h1>📋 Convenios Colectivos Disponibles</h1>
        <p className="convenios-subtitle">
          Total: {convenios.length} convenios con sus respectivas categorías
        </p>
      </div>

      <div className="convenios-info">
        <div className="info-card">
          <h3>ℹ️ Información</h3>
          <p>
            Los valores de sueldos básicos mostrados son ejemplos y deben actualizarse según 
            los acuerdos paritarios vigentes y la normativa actual.
          </p>
        </div>
      </div>

      <div className="convenios-grid">
        {convenios.length === 0 ? (
          <div className="sin-convenios">
            <p>No hay convenios cargados en el sistema.</p>
            <p>Los convenios se cargan automáticamente al iniciar el servidor.</p>
          </div>
        ) : (
          convenios.map((convenio) => {
            const categoriasConvenio = categorias[convenio.id] || [];
            const expandido = convenioExpandido === convenio.id;

            return (
              <div key={convenio.id} className="convenio-card">
                <div 
                  className="convenio-header"
                  onClick={() => toggleExpandir(convenio.id)}
                >
                  <div className="convenio-title">
                    <h2>{convenio.nombre}</h2>
                    <span className="convenio-count">
                      {categoriasConvenio.length} categorías
                    </span>
                  </div>
                  <button className="expand-button">
                    {expandido ? '▼' : '▶'}
                  </button>
                </div>
                
                {convenio.descripcion && (
                  <p className="convenio-descripcion">{convenio.descripcion}</p>
                )}

                {expandido && categoriasConvenio.length > 0 && (
                  <div className="categorias-list">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th>Categoría</th>
                          <th className="text-right">Sueldo Básico</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categoriasConvenio.map((cat) => (
                          <tr key={cat.id}>
                            <td><strong>{cat.codigo}</strong></td>
                            <td>{cat.nombre}</td>
                            <td className="text-right">
                              {formatearMoneda(cat.sueldo_basico)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {expandido && categoriasConvenio.length === 0 && (
                  <div className="sin-categorias">
                    <p>Este convenio no tiene categorías configuradas.</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Convenios;

