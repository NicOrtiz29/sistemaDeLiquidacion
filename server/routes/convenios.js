const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/init');

// Obtener todos los convenios
router.get('/', (req, res) => {
  const db = getDatabase();
  
  db.all(`
    SELECT * FROM convenios WHERE activo = 1 ORDER BY nombre
  `, (err, convenios) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(convenios);
  });
});

// Obtener categorías de un convenio
router.get('/:id/categorias', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.all(`
    SELECT * FROM categorias_convenio 
    WHERE convenio_id = ? AND activo = 1
    ORDER BY codigo
  `, [id], (err, categorias) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(categorias);
  });
});

// Obtener un convenio específico
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get(`
    SELECT * FROM convenios WHERE id = ? AND activo = 1
  `, [id], (err, convenio) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!convenio) {
      res.status(404).json({ error: 'Convenio no encontrado' });
      return;
    }
    res.json(convenio);
  });
});

module.exports = router;

