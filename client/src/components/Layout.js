import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            💼 Sistema de Liquidación
          </Link>
          <div className="navbar-menu">
            <Link to="/" className={`navbar-item ${isActive('/')}`}>
              Inicio
            </Link>
            <Link to="/empleados" className={`navbar-item ${isActive('/empleados')}`}>
              Empleados
            </Link>
            <Link to="/liquidacion" className={`navbar-item ${isActive('/liquidacion')}`}>
              Liquidación
            </Link>
            <Link to="/historial" className={`navbar-item ${isActive('/historial')}`}>
              Historial
            </Link>
            <Link to="/convenios" className={`navbar-item ${isActive('/convenios')}`}>
              Convenios
            </Link>
          </div>
        </div>
      </nav>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;

