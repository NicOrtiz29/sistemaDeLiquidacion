const express = require('express');
const router = express.Router();
const liquidacionService = require('../services/liquidacionService');

// Calcular liquidación
router.post('/calcular', async (req, res) => {
  try {
    const { empleado_id, periodo, conceptos_variables } = req.body;
    
    if (!empleado_id || !periodo) {
      return res.status(400).json({ 
        error: 'Faltan datos requeridos: empleado_id y periodo' 
      });
    }
    
    const liquidacion = await liquidacionService.calcularLiquidacion(
      empleado_id,
      periodo,
      conceptos_variables || []
    );
    
    res.json(liquidacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Guardar liquidación
router.post('/guardar', async (req, res) => {
  try {
    const { liquidacion, conceptos_variables } = req.body;
    
    const liquidacionId = await liquidacionService.guardarLiquidacion(
      liquidacion,
      conceptos_variables || []
    );
    
    res.json({ 
      id: liquidacionId, 
      message: 'Liquidación guardada exitosamente' 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener liquidación por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const liquidacion = await liquidacionService.obtenerLiquidacion(id);
    res.json(liquidacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las liquidaciones de un empleado
router.get('/empleado/:empleado_id', (req, res) => {
  const { getDatabase } = require('../database/init');
  const db = getDatabase();
  const { empleado_id } = req.params;
  
  db.all(`
    SELECT l.*, e.nombre || ' ' || e.apellido as empleado_nombre
    FROM liquidaciones l
    JOIN empleados e ON l.empleado_id = e.id
    WHERE l.empleado_id = ?
    ORDER BY l.periodo DESC, l.fecha_liquidacion DESC
  `, [empleado_id], (err, liquidaciones) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(liquidaciones);
  });
});

// Obtener todas las liquidaciones por período
router.get('/periodo/:periodo', (req, res) => {
  const { getDatabase } = require('../database/init');
  const db = getDatabase();
  const { periodo } = req.params;
  
  db.all(`
    SELECT l.*, e.nombre || ' ' || e.apellido as empleado_nombre, e.legajo
    FROM liquidaciones l
    JOIN empleados e ON l.empleado_id = e.id
    WHERE l.periodo = ?
    ORDER BY e.apellido, e.nombre
  `, [periodo], (err, liquidaciones) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(liquidaciones);
  });
});

module.exports = router;

