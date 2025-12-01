const express = require('express');
const router = express.Router();
const liquidacionService = require('../services/liquidacionService');

// Generar recibo de sueldo (por ahora devuelve JSON, después agregaremos PDF)
router.get('/:liquidacion_id', async (req, res) => {
  try {
    const { liquidacion_id } = req.params;
    const liquidacion = await liquidacionService.obtenerLiquidacion(liquidacion_id);
    
    // Formatear para recibo
    const recibo = {
      numero: liquidacion.id,
      periodo: liquidacion.periodo,
      fecha: liquidacion.fecha_liquidacion,
      empleado: {
        nombre: liquidacion.empleado_nombre,
        legajo: liquidacion.legajo,
        dni: liquidacion.dni,
        cuil: liquidacion.cuil
      },
      detalle: JSON.parse(liquidacion.detalle || '{}')
    };
    
    res.json(recibo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

