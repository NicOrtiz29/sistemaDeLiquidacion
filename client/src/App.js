import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Empleados from './pages/Empleados';
import Liquidacion from './pages/Liquidacion';
import Historial from './pages/Historial';
import Convenios from './pages/Convenios';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/empleados" element={<Empleados />} />
          <Route path="/liquidacion" element={<Liquidacion />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/convenios" element={<Convenios />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

