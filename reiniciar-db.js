/**
 * Script para reinicializar la base de datos
 * Útil para cargar los nuevos convenios después de actualizaciones
 */

const { initDatabase, getDatabase } = require('./server/database/init');
const path = require('path');
const fs = require('fs');

async function reinicializarDB() {
  try {
    console.log('🔄 Reinicializando base de datos...');
    
    // Obtener ruta de la base de datos
    const dbPath = path.join(__dirname, 'server/data/liquidacion.db');
    
    // Hacer backup si existe
    if (fs.existsSync(dbPath)) {
      const backupPath = `${dbPath}.backup.${Date.now()}`;
      fs.copyFileSync(dbPath, backupPath);
      console.log(`✅ Backup creado: ${backupPath}`);
      
      // Eliminar base de datos existente
      fs.unlinkSync(dbPath);
      console.log('🗑️  Base de datos anterior eliminada');
    }
    
    // Reinicializar
    await initDatabase();
    
    console.log('✅ Base de datos reinicializada correctamente');
    console.log('📋 Todos los convenios y categorías han sido cargados');
    console.log('');
    console.log('💡 Ahora puedes reiniciar el servidor para usar los nuevos convenios');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al reinicializar la base de datos:', error);
    process.exit(1);
  }
}

reinicializarDB();

