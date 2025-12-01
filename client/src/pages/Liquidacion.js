import React, { useState, useEffect } from 'react';
import { empleadosAPI, conveniosAPI, liquidacionAPI } from '../services/api';
import './Liquidacion.css';

const Liquidacion = () => {
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [periodo, setPeriodo] = useState('');
  const [liquidacion, setLiquidacion] = useState(null);
  const [conceptosVariables, setConceptosVariables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nuevoConcepto, setNuevoConcepto] = useState({
    concepto: '',
    tipo: 'haber',
    monto: '',
    cantidad: '',
  });

  useEffect(() => {
    cargarEmpleados();
    // Establecer período actual por defecto
    const fecha = new Date();
    const periodoDefault = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    setPeriodo(periodoDefault);
  }, []);

  const cargarEmpleados = async () => {
    try {
      const res = await empleadosAPI.getAll();
      setEmpleados(res.data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
      alert('Error al cargar los empleados');
    }
  };

  const handleCalcular = async () => {
    if (!empleadoSeleccionado || !periodo) {
      alert('Por favor seleccione un empleado y un período');
      return;
    }

    try {
      setLoading(true);
      const res = await liquidacionAPI.calcular({
        empleado_id: empleadoSeleccionado,
        periodo: periodo,
        conceptos_variables: conceptosVariables.map(c => ({
          concepto: c.concepto,
          tipo: c.tipo,
          monto: parseFloat(c.monto),
          cantidad: c.cantidad ? parseFloat(c.cantidad) : null,
        })),
      });

      setLiquidacion(res.data);
    } catch (error) {
      console.error('Error calculando liquidación:', error);
      alert('Error al calcular la liquidación: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGuardar = async () => {
    if (!liquidacion) {
      alert('Primero debe calcular la liquidación');
      return;
    }

    try {
      setLoading(true);
      await liquidacionAPI.guardar({
        liquidacion: liquidacion,
        conceptos_variables: conceptosVariables.map(c => ({
          concepto: c.concepto,
          tipo: c.tipo,
          monto: parseFloat(c.monto),
          cantidad: c.cantidad ? parseFloat(c.cantidad) : null,
        })),
      });

      alert('Liquidación guardada exitosamente');
      // Limpiar formulario
      setLiquidacion(null);
      setConceptosVariables([]);
      setEmpleadoSeleccionado(null);
    } catch (error) {
      console.error('Error guardando liquidación:', error);
      alert('Error al guardar la liquidación');
    } finally {
      setLoading(false);
    }
  };

  const agregarConceptoVariable = () => {
    if (!nuevoConcepto.concepto || !nuevoConcepto.monto) {
      alert('Complete todos los campos del concepto');
      return;
    }

    setConceptosVariables([...conceptosVariables, { ...nuevoConcepto }]);
    setNuevoConcepto({
      concepto: '',
      tipo: 'haber',
      monto: '',
      cantidad: '',
    });
  };

  const eliminarConceptoVariable = (index) => {
    setConceptosVariables(conceptosVariables.filter((_, i) => i !== index));
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(valor);
  };

  const empleadoInfo = empleados.find(e => e.id === parseInt(empleadoSeleccionado));

  return (
    <div className="liquidacion">
      <div className="liquidacion-header">
        <h1>Liquidación de Sueldos</h1>
        <p className="liquidacion-subtitle">Calcule y gestione las liquidaciones de sueldo de sus empleados</p>
      </div>

      <div className="liquidacion-form card">
        <h2>Datos de la Liquidación</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Empleado *</label>
            <select
              className="input"
              value={empleadoSeleccionado || ''}
              onChange={(e) => setEmpleadoSeleccionado(e.target.value)}
            >
              <option value="">Seleccione un empleado</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.legajo} - {emp.nombre} {emp.apellido}
                </option>
              ))}
            </select>
            {empleadoInfo && (
              <div className="empleado-info">
                <p><strong>DNI:</strong> {empleadoInfo.dni}</p>
                <p><strong>Convenio:</strong> {empleadoInfo.convenio_nombre || 'Sin convenio'}</p>
                <p><strong>Categoría:</strong> {empleadoInfo.categoria_nombre || empleadoInfo.categoria || '-'}</p>
              </div>
            )}
          </div>
          <div className="form-group">
            <label>Período *</label>
            <input
              type="month"
              className="input"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="conceptos-variables">
          <h3>Conceptos Variables</h3>
          <div className="concepto-form">
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  className="input"
                  placeholder="Concepto (ej: Horas Extras, Premio)"
                  value={nuevoConcepto.concepto}
                  onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, concepto: e.target.value })}
                />
              </div>
              <div className="form-group">
                <select
                  className="input"
                  value={nuevoConcepto.tipo}
                  onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, tipo: e.target.value })}
                >
                  <option value="haber">Haber</option>
                  <option value="descuento">Descuento</option>
                </select>
              </div>
              <div className="form-group">
                <input
                  type="number"
                  className="input"
                  placeholder="Monto"
                  step="0.01"
                  value={nuevoConcepto.monto}
                  onChange={(e) => setNuevoConcepto({ ...nuevoConcepto, monto: e.target.value })}
                />
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={agregarConceptoVariable}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          {conceptosVariables.length > 0 && (
            <div className="conceptos-list">
              <table className="table">
                <thead>
                  <tr>
                    <th>Concepto</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {conceptosVariables.map((concepto, index) => (
                    <tr key={index}>
                      <td>{concepto.concepto}</td>
                      <td>
                        <span className={`badge ${concepto.tipo === 'haber' ? 'badge-success' : 'badge-warning'}`}>
                          {concepto.tipo === 'haber' ? 'Haber' : 'Descuento'}
                        </span>
                      </td>
                      <td>{formatearMoneda(parseFloat(concepto.monto))}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => eliminarConceptoVariable(index)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            className="btn btn-primary"
            onClick={handleCalcular}
            disabled={loading || !empleadoSeleccionado || !periodo}
          >
            {loading ? 'Calculando...' : '🔄 Calcular Liquidación'}
          </button>
        </div>
      </div>

      {liquidacion && (
        <div className="liquidacion-resultado card">
          <h2>Resultado de la Liquidación</h2>
          
          <div className="empleado-header">
            <h3>{liquidacion.empleado.nombre}</h3>
            <p>Legajo: {liquidacion.empleado.legajo} | DNI: {liquidacion.empleado.dni}</p>
            <p>Convenio: {liquidacion.empleado.convenio} | Período: {liquidacion.periodo}</p>
          </div>

          <div className="liquidacion-detalle">
            <div className="haberes-section">
              <h3>Haberes</h3>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Sueldo Básico</td>
                    <td className="text-right">{formatearMoneda(liquidacion.haberes.sueldo_basico)}</td>
                  </tr>
                  <tr>
                    <td>Presentismo</td>
                    <td className="text-right">{formatearMoneda(liquidacion.haberes.presentismo)}</td>
                  </tr>
                  {liquidacion.haberes.horas_extras > 0 && (
                    <tr>
                      <td>Horas Extras</td>
                      <td className="text-right">{formatearMoneda(liquidacion.haberes.horas_extras)}</td>
                    </tr>
                  )}
                  {liquidacion.haberes.bonificaciones > 0 && (
                    <tr>
                      <td>Bonificaciones</td>
                      <td className="text-right">{formatearMoneda(liquidacion.haberes.bonificaciones)}</td>
                    </tr>
                  )}
                  {liquidacion.haberes.otros > 0 && (
                    <tr>
                      <td>Otros Haberes</td>
                      <td className="text-right">{formatearMoneda(liquidacion.haberes.otros)}</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td><strong>Total Haberes</strong></td>
                    <td className="text-right"><strong>{formatearMoneda(liquidacion.haberes.total)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="descuentos-section">
              <h3>Descuentos</h3>
              <table className="table">
                <tbody>
                  <tr>
                    <td>Jubilación (11%)</td>
                    <td className="text-right">{formatearMoneda(liquidacion.descuentos.jubilacion)}</td>
                  </tr>
                  <tr>
                    <td>Ley 19.032 (3%)</td>
                    <td className="text-right">{formatearMoneda(liquidacion.descuentos.ley_19032)}</td>
                  </tr>
                  <tr>
                    <td>Obra Social (3%)</td>
                    <td className="text-right">{formatearMoneda(liquidacion.descuentos.obra_social)}</td>
                  </tr>
                  <tr>
                    <td>Sindicato (2.5%)</td>
                    <td className="text-right">{formatearMoneda(liquidacion.descuentos.sindicato)}</td>
                  </tr>
                  <tr>
                    <td>Seguro de Vida (0.6%)</td>
                    <td className="text-right">{formatearMoneda(liquidacion.descuentos.seguro_vida)}</td>
                  </tr>
                  {liquidacion.descuentos.otros > 0 && (
                    <tr>
                      <td>Otros Descuentos</td>
                      <td className="text-right">{formatearMoneda(liquidacion.descuentos.otros)}</td>
                    </tr>
                  )}
                  <tr className="total-row">
                    <td><strong>Total Descuentos</strong></td>
                    <td className="text-right"><strong>{formatearMoneda(liquidacion.descuentos.total)}</strong></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="resumen-final">
            <div className="resumen-card">
              <h3>Resumen</h3>
              <div className="resumen-item">
                <span>Sueldo Bruto:</span>
                <span className="resumen-valor">{formatearMoneda(liquidacion.resumen.sueldo_bruto)}</span>
              </div>
              <div className="resumen-item">
                <span>Total Descuentos:</span>
                <span className="resumen-valor">{formatearMoneda(liquidacion.resumen.total_descuentos)}</span>
              </div>
              <div className="resumen-item resumen-total">
                <span>Sueldo Neto:</span>
                <span className="resumen-valor">{formatearMoneda(liquidacion.resumen.sueldo_neto)}</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button
              className="btn btn-success"
              onClick={handleGuardar}
              disabled={loading}
            >
              {loading ? 'Guardando...' : '💾 Guardar Liquidación'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liquidacion;

