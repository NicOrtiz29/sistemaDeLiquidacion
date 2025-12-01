const express = require('express');
const router = express.Router();
const { getDatabase } = require('../database/init');

// Obtener todos los empleados
router.get('/', (req, res) => {
  const db = getDatabase();
  
  db.all(`
    SELECT e.*, c.nombre as convenio_nombre, cat.nombre as categoria_nombre
    FROM empleados e
    LEFT JOIN convenios c ON e.convenio_id = c.id
    LEFT JOIN categorias_convenio cat ON e.categoria = cat.codigo AND c.id = cat.convenio_id
    WHERE e.activo = 1
    ORDER BY e.apellido, e.nombre
  `, (err, empleados) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(empleados);
  });
});

// Obtener un empleado por ID
router.get('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.get(`
    SELECT e.*, c.nombre as convenio_nombre, c.codigo as convenio_codigo,
           cat.nombre as categoria_nombre, cat.sueldo_basico as categoria_basico
    FROM empleados e
    LEFT JOIN convenios c ON e.convenio_id = c.id
    LEFT JOIN categorias_convenio cat ON e.categoria = cat.codigo AND c.id = cat.convenio_id
    WHERE e.id = ?
  `, [id], (err, empleado) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!empleado) {
      res.status(404).json({ error: 'Empleado no encontrado' });
      return;
    }
    res.json(empleado);
  });
});

// Crear un nuevo empleado
router.post('/', (req, res) => {
  const db = getDatabase();
  const {
    legajo,
    nombre,
    apellido,
    dni,
    cuil,
    fecha_ingreso,
    categoria,
    convenio_id,
    sueldo_basico,
    fecha_nacimiento,
    domicilio,
    telefono,
    email
  } = req.body;
  
  db.run(`
    INSERT INTO empleados 
    (legajo, nombre, apellido, dni, cuil, fecha_ingreso, categoria, 
     convenio_id, sueldo_basico, fecha_nacimiento, domicilio, telefono, email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    legajo,
    nombre,
    apellido,
    dni,
    cuil,
    fecha_ingreso,
    categoria,
    convenio_id,
    sueldo_basico,
    fecha_nacimiento,
    domicilio,
    telefono,
    email
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID, message: 'Empleado creado exitosamente' });
  });
});

// Actualizar un empleado
router.put('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  const {
    legajo,
    nombre,
    apellido,
    dni,
    cuil,
    fecha_ingreso,
    categoria,
    convenio_id,
    sueldo_basico,
    fecha_nacimiento,
    domicilio,
    telefono,
    email
  } = req.body;
  
  db.run(`
    UPDATE empleados SET
      legajo = ?,
      nombre = ?,
      apellido = ?,
      dni = ?,
      cuil = ?,
      fecha_ingreso = ?,
      categoria = ?,
      convenio_id = ?,
      sueldo_basico = ?,
      fecha_nacimiento = ?,
      domicilio = ?,
      telefono = ?,
      email = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [
    legajo,
    nombre,
    apellido,
    dni,
    cuil,
    fecha_ingreso,
    categoria,
    convenio_id,
    sueldo_basico,
    fecha_nacimiento,
    domicilio,
    telefono,
    email,
    id
  ], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Empleado actualizado exitosamente' });
  });
});

// Eliminar (desactivar) un empleado
router.delete('/:id', (req, res) => {
  const db = getDatabase();
  const { id } = req.params;
  
  db.run(`
    UPDATE empleados SET activo = 0, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Empleado desactivado exitosamente' });
  });
});

module.exports = router;

