const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const empleadosRoutes = require('./routes/empleados');
const liquidacionRoutes = require('./routes/liquidacion');
const conveniosRoutes = require('./routes/convenios');
const recibosRoutes = require('./routes/recibos');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/empleados', empleadosRoutes);
app.use('/api/liquidacion', liquidacionRoutes);
app.use('/api/convenios', conveniosRoutes);
app.use('/api/recibos', recibosRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sistema de Liquidación de Sueldos' });
});

// Inicializar base de datos y luego iniciar servidor
const { initDatabase } = require('./database/init');

async function startServer() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📊 Sistema de Liquidación de Sueldos iniciado`);
      console.log(`🌐 API disponible en http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

startServer();

