const { getDatabase } = require('../database/init');

/**
 * Calcula la liquidación de sueldo para un empleado
 * Incluye todos los aportes y descuentos legales de Argentina
 */
class LiquidacionService {
  
  /**
   * Calcula una liquidación completa de sueldo
   */
  async calcularLiquidacion(empleadoId, periodo, conceptosVariables = []) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      
      // Obtener datos del empleado
      db.get(`
        SELECT e.*, c.nombre as convenio_nombre, c.codigo as convenio_codigo,
               cat.nombre as categoria_nombre, cat.sueldo_basico as categoria_basico
        FROM empleados e
        LEFT JOIN convenios c ON e.convenio_id = c.id
        LEFT JOIN categorias_convenio cat ON e.categoria = cat.codigo AND c.id = cat.convenio_id
        WHERE e.id = ? AND e.activo = 1
      `, [empleadoId], async (err, empleado) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!empleado) {
          reject(new Error('Empleado no encontrado'));
          return;
        }

        // Determinar sueldo básico
        let sueldoBasico = empleado.sueldo_basico || empleado.categoria_basico;
        if (!sueldoBasico || sueldoBasico === 0) {
          sueldoBasico = 450000; // Valor por defecto
        }

        // Calcular conceptos positivos (haberes)
        const haberes = this.calcularHaberes(sueldoBasico, conceptosVariables);
        
        // Calcular conceptos negativos (descuentos)
        const descuentos = this.calcularDescuentos(haberes.total, empleado);
        
        // Calcular totales
        const sueldoBruto = haberes.total;
        const totalDescuentos = descuentos.total;
        const sueldoNeto = sueldoBruto - totalDescuentos;

        const liquidacion = {
          empleado_id: empleadoId,
          periodo: periodo,
          empleado: {
            nombre: `${empleado.nombre} ${empleado.apellido}`,
            legajo: empleado.legajo,
            dni: empleado.dni,
            cuil: empleado.cuil,
            convenio: empleado.convenio_nombre,
            categoria: empleado.categoria_nombre
          },
          haberes: haberes,
          descuentos: descuentos,
          resumen: {
            sueldo_bruto: sueldoBruto,
            total_descuentos: totalDescuentos,
            sueldo_neto: sueldoNeto
          },
          periodo: periodo
        };

        resolve(liquidacion);
      });
    });
  }

  /**
   * Calcula los haberes (conceptos positivos)
   */
  calcularHaberes(sueldoBasico, conceptosVariables) {
    const haberes = {
      sueldo_basico: sueldoBasico,
      presentismo: this.calcularPresentismo(sueldoBasico),
      antiguedad: 0, // Se calcula según años de antigüedad
      horas_extras: 0,
      bonificaciones: 0,
      otros: 0,
      total: 0
    };

    // Procesar conceptos variables
    conceptosVariables.forEach(concepto => {
      if (concepto.tipo === 'haber') {
        switch(concepto.concepto.toLowerCase()) {
          case 'horas_extras':
          case 'horas extras':
            haberes.horas_extras += concepto.monto;
            break;
          case 'bonificacion':
          case 'premio':
            haberes.bonificaciones += concepto.monto;
            break;
          default:
            haberes.otros += concepto.monto;
        }
      }
    });

    haberes.total = Object.values(haberes).reduce((sum, val) => {
      return typeof val === 'number' ? sum + val : sum;
    }, 0);

    return haberes;
  }

  /**
   * Calcula el presentismo (8.33% del básico si aplica)
   */
  calcularPresentismo(sueldoBasico) {
    return sueldoBasico * 0.0833; // 8.33% equivalente a 1/12
  }

  /**
   * Calcula todos los descuentos legales
   */
  calcularDescuentos(sueldoBruto, empleado) {
    // Valores actualizados 2024 (deben ajustarse según normativa vigente)
    const MIN_IMPONIBLE = 450000;
    const MAX_IMPONIBLE = 8800000; // Tope de remuneración imponible
    
    // Base imponible
    const baseImponible = Math.min(Math.max(sueldoBruto, MIN_IMPONIBLE), MAX_IMPONIBLE);

    const descuentos = {
      jubilacion: this.calcularPorcentaje(baseImponible, 11), // 11%
      ley_19032: this.calcularPorcentaje(baseImponible, 3),   // 3% (Ley 19.032)
      obra_social: this.calcularPorcentaje(baseImponible, 3), // 3%
      sindicato: this.calcularPorcentaje(baseImponible, 2.5), // 2.5% (varía por convenio)
      seguro_vida: this.calcularPorcentaje(baseImponible, 0.6), // 0.6%
      otros: 0,
      total: 0
    };

    // Calcular total
    descuentos.total = Object.values(descuentos).reduce((sum, val) => {
      return typeof val === 'number' ? sum + val : sum;
    }, 0);

    return descuentos;
  }

  /**
   * Calcula un porcentaje de un monto
   */
  calcularPorcentaje(monto, porcentaje) {
    return Math.round((monto * porcentaje / 100) * 100) / 100;
  }

  /**
   * Obtiene el detalle de una liquidación guardada
   */
  async obtenerLiquidacion(liquidacionId) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      
      db.get(`
        SELECT l.*, e.nombre || ' ' || e.apellido as empleado_nombre,
               e.legajo, e.dni, e.cuil
        FROM liquidaciones l
        JOIN empleados e ON l.empleado_id = e.id
        WHERE l.id = ?
      `, [liquidacionId], (err, liquidacion) => {
        if (err) {
          reject(err);
          return;
        }
        
        if (!liquidacion) {
          reject(new Error('Liquidación no encontrada'));
          return;
        }

        // Obtener conceptos variables
        db.all(`
          SELECT * FROM conceptos_variables WHERE liquidacion_id = ?
        `, [liquidacionId], (err, conceptos) => {
          if (err) {
            reject(err);
            return;
          }
          
          liquidacion.conceptos_variables = conceptos || [];
          resolve(liquidacion);
        });
      });
    });
  }

  /**
   * Guarda una liquidación en la base de datos
   */
  async guardarLiquidacion(liquidacion, conceptosVariables = []) {
    return new Promise((resolve, reject) => {
      const db = getDatabase();
      
      db.serialize(() => {
        db.run(`
          INSERT INTO liquidaciones 
          (empleado_id, periodo, sueldo_bruto, descuentos, sueldo_neto, detalle, estado)
          VALUES (?, ?, ?, ?, ?, ?, 'completada')
        `, [
          liquidacion.empleado_id,
          liquidacion.periodo,
          liquidacion.resumen.sueldo_bruto,
          liquidacion.resumen.total_descuentos,
          liquidacion.resumen.sueldo_neto,
          JSON.stringify(liquidacion)
        ], function(err) {
          if (err) {
            reject(err);
            return;
          }
          
          const liquidacionId = this.lastID;
          
          // Guardar conceptos variables
          if (conceptosVariables.length > 0) {
            const stmt = db.prepare(`
              INSERT INTO conceptos_variables (liquidacion_id, concepto, tipo, monto, cantidad)
              VALUES (?, ?, ?, ?, ?)
            `);
            
            conceptosVariables.forEach(concepto => {
              stmt.run([
                liquidacionId,
                concepto.concepto,
                concepto.tipo,
                concepto.monto,
                concepto.cantidad || null
              ]);
            });
            
            stmt.finalize((err) => {
              if (err) {
                reject(err);
                return;
              }
              resolve(liquidacionId);
            });
          } else {
            resolve(liquidacionId);
          }
        });
      });
    });
  }
}

module.exports = new LiquidacionService();

