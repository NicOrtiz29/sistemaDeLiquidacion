const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/liquidacion.db');

// Asegurar que el directorio existe
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Tabla de empleados
      db.run(`
        CREATE TABLE IF NOT EXISTS empleados (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          legajo TEXT UNIQUE,
          nombre TEXT NOT NULL,
          apellido TEXT NOT NULL,
          dni TEXT NOT NULL,
          cuil TEXT,
          fecha_ingreso DATE,
          categoria TEXT,
          convenio_id INTEGER,
          sueldo_basico REAL,
          fecha_nacimiento DATE,
          domicilio TEXT,
          telefono TEXT,
          email TEXT,
          activo INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (convenio_id) REFERENCES convenios(id)
        )
      `);

      // Tabla de convenios colectivos
      db.run(`
        CREATE TABLE IF NOT EXISTS convenios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          codigo TEXT UNIQUE NOT NULL,
          nombre TEXT NOT NULL,
          descripcion TEXT,
          activo INTEGER DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Tabla de categorías por convenio
      db.run(`
        CREATE TABLE IF NOT EXISTS categorias_convenio (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          convenio_id INTEGER NOT NULL,
          codigo TEXT NOT NULL,
          nombre TEXT NOT NULL,
          sueldo_basico REAL NOT NULL,
          adicionales TEXT,
          activo INTEGER DEFAULT 1,
          FOREIGN KEY (convenio_id) REFERENCES convenios(id)
        )
      `);

      // Tabla de liquidaciones
      db.run(`
        CREATE TABLE IF NOT EXISTS liquidaciones (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          empleado_id INTEGER NOT NULL,
          periodo TEXT NOT NULL,
          fecha_liquidacion DATE DEFAULT CURRENT_DATE,
          sueldo_bruto REAL,
          descuentos REAL,
          sueldo_neto REAL,
          detalle TEXT,
          estado TEXT DEFAULT 'pendiente',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (empleado_id) REFERENCES empleados(id)
        )
      `);

      // Tabla de conceptos variables
      db.run(`
        CREATE TABLE IF NOT EXISTS conceptos_variables (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          liquidacion_id INTEGER NOT NULL,
          concepto TEXT NOT NULL,
          tipo TEXT NOT NULL,
          monto REAL NOT NULL,
          cantidad REAL,
          FOREIGN KEY (liquidacion_id) REFERENCES liquidaciones(id)
        )
      `);

      // Insertar convenios iniciales - Todos los convenios comunes de Argentina
      db.run(`
        INSERT OR IGNORE INTO convenios (codigo, nombre, descripcion)
        VALUES 
        ('TEXTIL', 'Convenio Colectivo de Trabajo Textil', 'Convenio para la industria textil'),
        ('COMERCIO', 'Convenio Colectivo de Trabajo Comercio', 'Convenio para comercio'),
        ('METALURGICO', 'Convenio Colectivo de Trabajo Metalúrgico', 'Convenio para industria metalúrgica'),
        ('ADMINISTRATIVO', 'Convenio Administrativo', 'Convenio para personal administrativo'),
        ('CONSTRUCCION', 'Convenio Colectivo de Trabajo Construcción', 'Convenio para industria de la construcción'),
        ('GASTRONOMIA', 'Convenio Colectivo de Trabajo Gastronomía', 'Convenio para personal de gastronomía y hotelería'),
        ('TRANSPORTE', 'Convenio Colectivo de Trabajo Transporte', 'Convenio para personal de transporte'),
        ('SEGURIDAD', 'Convenio Colectivo de Trabajo Seguridad', 'Convenio para personal de seguridad privada'),
        ('EDUCACION', 'Convenio Colectivo de Trabajo Educación', 'Convenio para personal de educación privada'),
        ('SALUD', 'Convenio Colectivo de Trabajo Salud', 'Convenio para personal de salud privado'),
        ('BANCARIO', 'Convenio Colectivo de Trabajo Bancario', 'Convenio para personal bancario'),
        ('SEGUROS', 'Convenio Colectivo de Trabajo Seguros', 'Convenio para personal de compañías de seguros'),
        ('PETROLERO', 'Convenio Colectivo de Trabajo Petrolero', 'Convenio para industria petrolera'),
        ('QUIMICO', 'Convenio Colectivo de Trabajo Químico', 'Convenio para industria química'),
        ('GRAFICO', 'Convenio Colectivo de Trabajo Gráfico', 'Convenio para industria gráfica'),
        ('ALIMENTACION', 'Convenio Colectivo de Trabajo Alimentación', 'Convenio para industria alimenticia'),
        ('FARMACEUTICO', 'Convenio Colectivo de Trabajo Farmacéutico', 'Convenio para industria farmacéutica'),
        ('AUTOMOTRIZ', 'Convenio Colectivo de Trabajo Automotriz', 'Convenio para industria automotriz'),
        ('CALZADO', 'Convenio Colectivo de Trabajo Calzado', 'Convenio para industria del calzado'),
        ('MAQUINISTA', 'Convenio Colectivo de Trabajo Maquinista', 'Convenio para maquinistas y operarios de máquinas'),
        ('ELECTRICIDAD', 'Convenio Colectivo de Trabajo Electricidad', 'Convenio para personal de electricidad'),
        ('PLASTICO', 'Convenio Colectivo de Trabajo Plástico', 'Convenio para industria del plástico'),
        ('MADERA', 'Convenio Colectivo de Trabajo Madera', 'Convenio para industria maderera'),
        ('VIDRIO', 'Convenio Colectivo de Trabajo Vidrio', 'Convenio para industria del vidrio'),
        ('CERAMICA', 'Convenio Colectivo de Trabajo Cerámica', 'Convenio para industria cerámica'),
        ('CEMENTO', 'Convenio Colectivo de Trabajo Cemento', 'Convenio para industria del cemento'),
        ('PAPEL', 'Convenio Colectivo de Trabajo Papel', 'Convenio para industria del papel'),
        ('CAUCHO', 'Convenio Colectivo de Trabajo Caucho', 'Convenio para industria del caucho'),
        ('MINERIA', 'Convenio Colectivo de Trabajo Minería', 'Convenio para industria minera'),
        ('AGRICOLA', 'Convenio Colectivo de Trabajo Agrícola', 'Convenio para trabajadores agrícolas')
      `, (err) => {
        if (err) {
          console.error('Error insertando convenios:', err);
          resolve();
        } else {
          console.log('✅ Base de datos inicializada correctamente');
          // Insertar categorías para todos los convenios
          insertarTodasLasCategorias().then(() => resolve());
        }
      });
    });
  });
};

const insertarTodasLasCategorias = () => {
  return new Promise((resolve) => {
    // Obtener todos los convenios
    db.all('SELECT id, codigo FROM convenios', (err, convenios) => {
      if (err || !convenios.length) {
        resolve();
        return;
      }

      let insertados = 0;
      const total = convenios.length;

      convenios.forEach(convenio => {
        insertarCategoriasPorConvenio(convenio.id, convenio.codigo, () => {
          insertados++;
          if (insertados === total) {
            console.log('✅ Categorías inicializadas correctamente');
            resolve();
          }
        });
      });
    });
  });
};

const insertarCategoriasPorConvenio = (convenioId, codigoConvenio, callback) => {
  let categorias = [];

  switch(codigoConvenio) {
    case 'TEXTIL':
      // Convenio Textil - Categorías actualizadas (valores a actualizar según convenio vigente)
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 450000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 480000 },
        { codigo: 'OP3', nombre: 'Operario Nivel 3', basico: 510000 },
        { codigo: 'OP4', nombre: 'Operario Nivel 4', basico: 540000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 580000 },
        { codigo: 'CAP', nombre: 'Capataz', basico: 620000 },
        { codigo: 'JEF', nombre: 'Jefe de Sección', basico: 680000 },
        { codigo: 'ADM', nombre: 'Personal Administrativo Textil', basico: 520000 },
      ];
      break;

    case 'COMERCIO':
      categorias = [
        { codigo: 'VEND1', nombre: 'Vendedor Nivel 1', basico: 420000 },
        { codigo: 'VEND2', nombre: 'Vendedor Nivel 2', basico: 460000 },
        { codigo: 'VEND3', nombre: 'Vendedor Nivel 3', basico: 500000 },
        { codigo: 'SUP', nombre: 'Supervisor de Ventas', basico: 560000 },
        { codigo: 'ADM', nombre: 'Personal Administrativo', basico: 480000 },
      ];
      break;

    case 'METALURGICO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 470000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 500000 },
        { codigo: 'OP3', nombre: 'Operario Nivel 3', basico: 530000 },
        { codigo: 'OP4', nombre: 'Operario Nivel 4', basico: 560000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 600000 },
        { codigo: 'CAP', nombre: 'Capataz', basico: 640000 },
        { codigo: 'TEC', nombre: 'Técnico', basico: 580000 },
      ];
      break;

    case 'ADMINISTRATIVO':
      categorias = [
        { codigo: 'ADM1', nombre: 'Administrativo Nivel 1', basico: 440000 },
        { codigo: 'ADM2', nombre: 'Administrativo Nivel 2', basico: 480000 },
        { codigo: 'ADM3', nombre: 'Administrativo Nivel 3', basico: 520000 },
        { codigo: 'SUP', nombre: 'Supervisor Administrativo', basico: 560000 },
        { codigo: 'GER', nombre: 'Gerente Administrativo', basico: 700000 },
      ];
      break;

    case 'CONSTRUCCION':
      categorias = [
        { codigo: 'AYU', nombre: 'Ayudante', basico: 460000 },
        { codigo: 'OFF1', nombre: 'Oficial 1era', basico: 520000 },
        { codigo: 'OFF2', nombre: 'Oficial 2da', basico: 500000 },
        { codigo: 'OFF3', nombre: 'Oficial 3era', basico: 480000 },
        { codigo: 'CAP', nombre: 'Capataz', basico: 600000 },
        { codigo: 'MAES', nombre: 'Maestro Mayor de Obra', basico: 680000 },
      ];
      break;

    case 'GASTRONOMIA':
      categorias = [
        { codigo: 'MOZO', nombre: 'Mozo', basico: 430000 },
        { codigo: 'COC1', nombre: 'Cocinero Nivel 1', basico: 470000 },
        { codigo: 'COC2', nombre: 'Cocinero Nivel 2', basico: 510000 },
        { codigo: 'COC3', nombre: 'Cocinero Nivel 3', basico: 550000 },
        { codigo: 'BART', nombre: 'Bartender', basico: 480000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 580000 },
      ];
      break;

    case 'TRANSPORTE':
      categorias = [
        { codigo: 'CHOF1', nombre: 'Chofer Nivel 1', basico: 490000 },
        { codigo: 'CHOF2', nombre: 'Chofer Nivel 2', basico: 530000 },
        { codigo: 'CHOF3', nombre: 'Chofer Nivel 3', basico: 570000 },
        { codigo: 'MECH', nombre: 'Mecánico', basico: 510000 },
        { codigo: 'AYU', nombre: 'Ayudante', basico: 430000 },
      ];
      break;

    case 'SEGURIDAD':
      categorias = [
        { codigo: 'VIG1', nombre: 'Vigilador Nivel 1', basico: 420000 },
        { codigo: 'VIG2', nombre: 'Vigilador Nivel 2', basico: 460000 },
        { codigo: 'SUP', nombre: 'Supervisor de Seguridad', basico: 540000 },
        { codigo: 'JEF', nombre: 'Jefe de Seguridad', basico: 620000 },
      ];
      break;

    case 'EDUCACION':
      categorias = [
        { codigo: 'PROF1', nombre: 'Profesor Nivel 1', basico: 520000 },
        { codigo: 'PROF2', nombre: 'Profesor Nivel 2', basico: 580000 },
        { codigo: 'PROF3', nombre: 'Profesor Nivel 3', basico: 640000 },
        { codigo: 'ADM', nombre: 'Personal Administrativo', basico: 480000 },
        { codigo: 'DIR', nombre: 'Director', basico: 750000 },
      ];
      break;

    case 'SALUD':
      categorias = [
        { codigo: 'ENF1', nombre: 'Enfermero Nivel 1', basico: 510000 },
        { codigo: 'ENF2', nombre: 'Enfermero Nivel 2', basico: 560000 },
        { codigo: 'TEC', nombre: 'Técnico', basico: 490000 },
        { codigo: 'ADM', nombre: 'Personal Administrativo', basico: 480000 },
      ];
      break;

    case 'BANCARIO':
      categorias = [
        { codigo: 'CAJ1', nombre: 'Cajero Nivel 1', basico: 490000 },
        { codigo: 'CAJ2', nombre: 'Cajero Nivel 2', basico: 540000 },
        { codigo: 'OFI1', nombre: 'Oficial Nivel 1', basico: 580000 },
        { codigo: 'OFI2', nombre: 'Oficial Nivel 2', basico: 630000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 680000 },
      ];
      break;

    case 'SEGUROS':
      categorias = [
        { codigo: 'PROD1', nombre: 'Productor Nivel 1', basico: 470000 },
        { codigo: 'PROD2', nombre: 'Productor Nivel 2', basico: 520000 },
        { codigo: 'ADM', nombre: 'Administrativo', basico: 480000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 600000 },
      ];
      break;

    case 'PETROLERO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 550000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 590000 },
        { codigo: 'TEC', nombre: 'Técnico', basico: 630000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 700000 },
      ];
      break;

    case 'QUIMICO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 480000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 520000 },
        { codigo: 'TEC', nombre: 'Técnico Químico', basico: 580000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 640000 },
      ];
      break;

    case 'GRAFICO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 470000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 510000 },
        { codigo: 'TEC', nombre: 'Técnico', basico: 560000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 620000 },
      ];
      break;

    case 'ALIMENTACION':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 460000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 500000 },
        { codigo: 'OP3', nombre: 'Operario Nivel 3', basico: 540000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 600000 },
      ];
      break;

    case 'FARMACEUTICO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 490000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 530000 },
        { codigo: 'TEC', nombre: 'Técnico', basico: 590000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 650000 },
      ];
      break;

    case 'AUTOMOTRIZ':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 480000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 520000 },
        { codigo: 'MECH', nombre: 'Mecánico', basico: 570000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 630000 },
      ];
      break;

    case 'CALZADO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 440000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 480000 },
        { codigo: 'OP3', nombre: 'Operario Nivel 3', basico: 520000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 580000 },
      ];
      break;

    case 'MAQUINISTA':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario de Máquina Nivel 1', basico: 500000 },
        { codigo: 'OP2', nombre: 'Operario de Máquina Nivel 2', basico: 540000 },
        { codigo: 'MAQ', nombre: 'Maquinista Especializado', basico: 600000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 660000 },
      ];
      break;

    case 'ELECTRICIDAD':
      categorias = [
        { codigo: 'AYU', nombre: 'Ayudante Electricista', basico: 460000 },
        { codigo: 'ELEC1', nombre: 'Electricista Nivel 1', basico: 520000 },
        { codigo: 'ELEC2', nombre: 'Electricista Nivel 2', basico: 570000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 630000 },
      ];
      break;

    case 'PLASTICO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 470000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 510000 },
        { codigo: 'TEC', nombre: 'Técnico', basico: 560000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 620000 },
      ];
      break;

    case 'MADERA':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 460000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 500000 },
        { codigo: 'EBAN', nombre: 'Ebanista', basico: 550000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 610000 },
      ];
      break;

    case 'VIDRIO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 470000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 510000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 590000 },
      ];
      break;

    case 'CERAMICA':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 460000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 500000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 580000 },
      ];
      break;

    case 'CEMENTO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 490000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 530000 },
        { codigo: 'TEC', nombre: 'Técnico', basico: 590000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 650000 },
      ];
      break;

    case 'PAPEL':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 470000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 510000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 590000 },
      ];
      break;

    case 'CAUCHO':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 480000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 520000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 600000 },
      ];
      break;

    case 'MINERIA':
      categorias = [
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 540000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 580000 },
        { codigo: 'TEC', nombre: 'Técnico', basico: 640000 },
        { codigo: 'SUP', nombre: 'Supervisor', basico: 700000 },
      ];
      break;

    case 'AGRICOLA':
      categorias = [
        { codigo: 'PEON', nombre: 'Peón', basico: 430000 },
        { codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 480000 },
        { codigo: 'OP2', nombre: 'Operario Nivel 2', basico: 520000 },
        { codigo: 'CAP', nombre: 'Capataz', basico: 580000 },
      ];
      break;

    default:
      callback();
      return;
  }

  let insertadas = 0;
  categorias.forEach((cat, index) => {
    db.run(`
      INSERT OR IGNORE INTO categorias_convenio (convenio_id, codigo, nombre, sueldo_basico)
      VALUES (?, ?, ?, ?)
    `, [convenioId, cat.codigo, cat.nombre, cat.basico], () => {
      insertadas++;
      if (insertadas === categorias.length) {
        callback();
      }
    });
  });
};

const getDatabase = () => db;

module.exports = { initDatabase, getDatabase };

