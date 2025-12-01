# 💡 Ejemplos de Uso

## Ejemplo 1: Liquidar Sueldo Básico

1. Ir a **Empleados** → Crear nuevo empleado
   - Legajo: 001
   - Nombre: Juan
   - Apellido: Pérez
   - DNI: 12345678
   - Convenio: Textil
   - Categoría: Operario Nivel 1

2. Ir a **Liquidación**
   - Seleccionar empleado: Juan Pérez
   - Período: 2024-01
   - Hacer clic en "Calcular Liquidación"

3. El sistema calculará automáticamente:
   - Sueldo Básico
   - Presentismo (8.33%)
   - Descuentos legales
   - Sueldo Neto

4. Hacer clic en "Guardar Liquidación"

## Ejemplo 2: Liquidar con Horas Extras

1. En la página de **Liquidación**
2. Seleccionar empleado y período
3. En "Conceptos Variables":
   - Concepto: "Horas Extras"
   - Tipo: Haber
   - Monto: 50000
   - Hacer clic en "Agregar"
4. Calcular y guardar

## Ejemplo 3: Consultar Historial

1. Ir a **Historial**
2. Seleccionar período: 2024-01
3. Ver todas las liquidaciones del período
4. Ver totales por empleado

## Ejemplo 4: Agregar Bonificación

1. En **Liquidación**, agregar concepto:
   - Concepto: "Premio por Productividad"
   - Tipo: Haber
   - Monto: 30000
2. Calcular y ver el resultado actualizado

## Ejemplo 5: Liquidar Múltiples Empleados

1. Ir a **Empleados** y crear varios empleados
2. Para cada uno, ir a **Liquidación**
3. Calcular y guardar
4. Ir a **Historial** para ver todas las liquidaciones

---

## 💼 Caso de Uso Real: Empresa Textil

**Escenario:** Empresa textil con 5 empleados

1. **Configurar Empleados:**
   - 2 Operarios Nivel 2 (Convenio Textil)
   - 1 Operario Nivel 3 (Convenio Textil)
   - 1 Supervisor (Convenio Textil)
   - 1 Administrativo (Convenio Textil)

2. **Liquidar Mes de Enero 2024:**
   - Para cada empleado:
     - Calcular liquidación base
     - Agregar horas extras si corresponde
     - Agregar bonificaciones
     - Guardar liquidación

3. **Revisar:**
   - Ir a Historial
   - Filtrar por período: 2024-01
   - Ver totales liquidados
   - Exportar para contador

---

## 📊 Estructura de una Liquidación

```
┌─────────────────────────────────┐
│   LIQUIDACIÓN DE SUELDO         │
├─────────────────────────────────┤
│ HABERES:                        │
│   • Sueldo Básico:    $450,000  │
│   • Presentismo:      $ 37,500  │
│   • Horas Extras:     $ 50,000  │
│   ──────────────────────────────│
│   TOTAL HABERES:      $537,500  │
├─────────────────────────────────┤
│ DESCUENTOS:                     │
│   • Jubilación (11%): $ 59,125  │
│   • Ley 19.032 (3%):  $ 16,125  │
│   • Obra Social (3%): $ 16,125  │
│   • Sindicato (2.5%): $ 13,438  │
│   • Seguro Vida (0.6%):$ 3,225  │
│   ──────────────────────────────│
│   TOTAL DESCUENTOS:   $108,038  │
├─────────────────────────────────┤
│ SUELDO NETO:         $429,462   │
└─────────────────────────────────┘
```

---

## ⚡ Tips y Trucos

1. **Usar el Dashboard** para ver un resumen rápido
2. **Guardar siempre** las liquidaciones después de calcular
3. **Revisar el Historial** antes de cerrar el mes
4. **Exportar datos** para respaldos (funcionalidad futura)
5. **Actualizar convenios** periódicamente según paritarias

---

¡Listo para comenzar! 🚀

