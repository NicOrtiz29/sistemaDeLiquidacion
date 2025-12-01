import React, { useState, useEffect } from 'react';
import { liquidacionAPI, empleadosAPI } from '../services/api';
import './Historial.css';

const Historial = () => {
  const [liquidaciones, setLiquidaciones] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [periodoFiltro, setPeriodoFiltro] = useState('');
  const [empleadoFiltro, setEmpleadoFiltro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEmpleados();
    const fecha = new Date();
    const periodoDefault = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    setPeriodoFiltro(periodoDefault);
  }, []);

  useEffect(() => {
    if (periodoFiltro) {
      cargarLiquidaciones();
    }
  }, [periodoFiltro, empleadoFiltro]);

  const cargarEmpleados = async () => {
    try {
      const res = await empleadosAPI.getAll();
      setEmpleados(res.data);
    } catch (error) {
      console.error('Error cargando empleados:', error);
    }
  };

  const cargarLiquidaciones = async () => {
    try {
      setLoading(true);
      let res;

      if (empleadoFiltro) {
        res = await liquidacionAPI.getByEmpleado(empleadoFiltro);
      } else {
        res = await liquidacionAPI.getByPeriodo(periodoFiltro);
      }

      // Filtrar por período si hay filtro de empleado
      let liquidacionesFiltradas = res.data;
      if (empleadoFiltro && periodoFiltro) {
        liquidacionesFiltradas = res.data.filter(liq => liq.periodo === periodoFiltro);
      }

      setLiquidaciones(liquidacionesFiltradas);
    } catch (error) {
      console.error('Error cargando liquidaciones:', error);
      alert('Error al cargar las liquidaciones');
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
    }).format(valor);
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-AR');
  };

  return (
    <div className="historial">
      <div className="historial-header">
        <h1>Historial de Liquidaciones</h1>
        <p className="historial-subtitle">Consulte el historial de liquidaciones de sueldos</p>
      </div>

      <div className="filtros card">
        <h2>Filtros</h2>
        <div className="form-row">
          <div className="form-group">
            <label>Período</label>
            <input
              type="month"
              className="input"
              value={periodoFiltro}
              onChange={(e) => setPeriodoFiltro(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Empleado (Opcional)</label>
            <select
              className="input"
              value={empleadoFiltro}
              onChange={(e) => setEmpleadoFiltro(e.target.value)}
            >
              <option value="">Todos los empleados</option>
              {empleados.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.legajo} - {emp.nombre} {emp.apellido}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="liquidaciones-list card">
        <h2>Liquidaciones</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : liquidaciones.length === 0 ? (
          <p className="sin-resultados">No se encontraron liquidaciones para los filtros seleccionados.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Período</th>
                <th>Empleado</th>
                <th>Legajo</th>
                <th>Fecha</th>
                <th>Sueldo Bruto</th>
                <th>Descuentos</th>
                <th>Sueldo Neto</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {liquidaciones.map((liq) => (
                <tr key={liq.id}>
                  <td>{liq.periodo}</td>
                  <td>{liq.empleado_nombre}</td>
                  <td>{liq.legajo || '-'}</td>
                  <td>{formatearFecha(liq.fecha_liquidacion)}</td>
                  <td className="text-right">{formatearMoneda(liq.sueldo_bruto)}</td>
                  <td className="text-right">{formatearMoneda(liq.descuentos)}</td>
                  <td className="text-right font-bold">{formatearMoneda(liq.sueldo_neto)}</td>
                  <td>
                    <span className={`badge ${liq.estado === 'completada' ? 'badge-success' : 'badge-warning'}`}>
                      {liq.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {liquidaciones.length > 0 && (
              <tfoot>
                <tr className="total-row">
                  <td colSpan="4"><strong>Total</strong></td>
                  <td className="text-right">
                    <strong>
                      {formatearMoneda(
                        liquidaciones.reduce((sum, liq) => sum + (liq.sueldo_bruto || 0), 0)
                      )}
                    </strong>
                  </td>
                  <td className="text-right">
                    <strong>
                      {formatearMoneda(
                        liquidaciones.reduce((sum, liq) => sum + (liq.descuentos || 0), 0)
                      )}
                    </strong>
                  </td>
                  <td className="text-right">
                    <strong>
                      {formatearMoneda(
                        liquidaciones.reduce((sum, liq) => sum + (liq.sueldo_neto || 0), 0)
                      )}
                    </strong>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </div>
  );
};

export default Historial;

