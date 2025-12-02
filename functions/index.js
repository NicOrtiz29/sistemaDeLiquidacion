/**
 * Firebase Cloud Functions
 * Backend del Sistema de Liquidación de Sueldos
 */

const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Importar rutas
const empleadosRoutes = require('../server/routes/empleados');
const liquidacionRoutes = require('../server/routes/liquidacion');
const conveniosRoutes = require('../server/routes/convenios');
const recibosRoutes = require('../server/routes/recibos');

// Inicializar base de datos
const { initDatabase } = require('../server/database/init');

// Crear app Express
const app = express();

// CORS configurado para Netlify
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'https://liquidacionessebi.netlify.app',
      /\.netlify\.app$/,
    ];
    
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    callback(null, isAllowed || true);
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Inicializar base de datos antes de las rutas
app.use(async (req, res, next) => {
  try {
    await initDatabase();
    next();
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    res.status(500).json({ error: 'Error inicializando base de datos' });
  }
});

// Routes
app.use('/api/empleados', empleadosRoutes);
app.use('/api/liquidacion', liquidacionRoutes);
app.use('/api/convenios', conveniosRoutes);
app.use('/api/recibos', recibosRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sistema de Liquidación de Sueldos - Firebase Functions' });
});

// Exportar como Cloud Function
// La URL será: https://us-central1-PROJECT.cloudfunctions.net/api
// Y las rutas serán: /api/empleados, /api/liquidacion, etc.
exports.api = functions.https.onRequest(app);

