import React, { useState, useEffect } from 'react';
import { empleadosAPI, liquidacionAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEmpleados: 0,
    liquidacionesMes: 0,
    totalLiquidado: 0,
  });
  const [loading, setLoading] = useState(true);
  const [periodoActual, setPeriodoActual] = useState('');

  useEffect(() => {
    const fecha = new Date();
    const periodo = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
    setPeriodoActual(periodo);
    cargarEstadisticas(periodo);
  }, []);

  const cargarEstadisticas = async (periodo) => {
    try {
      setLoading(true);
      const [empleadosRes, liquidacionesRes] = await Promise.all([
        empleadosAPI.getAll(),
        liquidacionAPI.getByPeriodo(periodo),
      ]);

      const empleados = empleadosRes.data;
      const liquidaciones = liquidacionesRes.data;

      const totalLiquidado = liquidaciones.reduce((sum, liq) => sum + (liq.sueldo_neto || 0), 0);

      setStats({
        totalEmpleados: empleados.length,
        liquidacionesMes: liquidaciones.length,
        totalLiquidado: totalLiquidado,
      });
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
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

  if (loading) {
    return (
      <div className="dashboard">
        <h1>Panel de Control</h1>
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Panel de Control</h1>
        <p className="dashboard-subtitle">Resumen del sistema de liquidación de sueldos</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Empleados</h3>
            <p className="stat-value">{stats.totalEmpleados}</p>
            <p className="stat-label">Activos en el sistema</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Liquidaciones del Mes</h3>
            <p className="stat-value">{stats.liquidacionesMes}</p>
            <p className="stat-label">Período {periodoActual}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Liquidado</h3>
            <p className="stat-value">{formatearMoneda(stats.totalLiquidado)}</p>
            <p className="stat-label">En el período actual</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <div className="card">
          <h2>Acciones Rápidas</h2>
          <div className="action-buttons">
            <a href="/empleados" className="action-btn">
              ➕ Agregar Empleado
            </a>
            <a href="/liquidacion" className="action-btn">
              💼 Nueva Liquidación
            </a>
            <a href="/historial" className="action-btn">
              📋 Ver Historial
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

