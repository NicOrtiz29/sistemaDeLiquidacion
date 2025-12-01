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
// CORS configurado para permitir requests desde Netlify
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requests sin origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      'http://localhost:3000',
      'https://liquidacionessebi.netlify.app',
      /\.netlify\.app$/, // Cualquier subdominio de netlify
    ];
    
    // Verificar si el origin está permitido
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // Permitir todos por ahora (en producción ajustar)
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
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

