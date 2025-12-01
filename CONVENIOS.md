# 📋 Guía de Convenios Colectivos

## ✅ 30 Convenios Disponibles

El sistema incluye **30 convenios colectivos** comunes en Argentina, cada uno con múltiples categorías y sueldos básicos configurados.

**📖 Para ver la lista completa:** Consulta `LISTA-CONVENIOS.md` o ve a la página **"Convenios"** en el sistema.

## Convenios Principales

### 1. Convenio Textil 🧵
**Código:** TEXTIL

Categorías disponibles:
- **OP1** - Operario Nivel 1
- **OP2** - Operario Nivel 2
- **OP3** - Operario Nivel 3
- **OP4** - Operario Nivel 4
- **SUP** - Supervisor
- **CAP** - Capataz
- **JEF** - Jefe de Sección
- **ADM** - Personal Administrativo Textil

### 2. Convenio Comercio 🛒
**Código:** COMERCIO

Categorías disponibles:
- **VEND1** - Vendedor Nivel 1
- **VEND2** - Vendedor Nivel 2
- **VEND3** - Vendedor Nivel 3
- **SUP** - Supervisor de Ventas
- **ADM** - Personal Administrativo

### 3. Convenio Metalúrgico ⚙️
**Código:** METALURGICO

Categorías disponibles:
- **OP1** - Operario Nivel 1
- **OP2** - Operario Nivel 2
- **OP3** - Operario Nivel 3
- **OP4** - Operario Nivel 4
- **SUP** - Supervisor
- **CAP** - Capataz
- **TEC** - Técnico

### 4. Convenio Administrativo 📝
**Código:** ADMINISTRATIVO

Categorías disponibles:
- **ADM1** - Administrativo Nivel 1
- **ADM2** - Administrativo Nivel 2
- **ADM3** - Administrativo Nivel 3
- **SUP** - Supervisor Administrativo
- **GER** - Gerente Administrativo

## ⚠️ Actualizar Valores

**IMPORTANTE:** Los valores de sueldos básicos son ejemplos. Debes actualizarlos según:

1. Acuerdos paritarios vigentes
2. Convenios colectivos oficiales
3. Actualizaciones salariales

### Cómo Actualizar Valores

1. Editar archivo: `server/database/init.js`
2. Buscar la función `insertarCategoriasPorConvenio`
3. Actualizar los valores de `basico` para cada categoría
4. Reiniciar el servidor para aplicar cambios

### Ejemplo de Actualización

```javascript
// Antes
{ codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 450000 }

// Después (actualizar con valor real)
{ codigo: 'OP1', nombre: 'Operario Nivel 1', basico: 550000 }
```

## 📊 Descuentos Aplicados

Todos los convenios utilizan los mismos descuentos legales:

- **Jubilación:** 11%
- **Ley 19.032:** 3%
- **Obra Social:** 3%
- **Sindicato:** 2.5%
- **Seguro de Vida:** 0.6%

*Nota: Revisar porcentajes según normativa vigente*

## 🔄 Agregar Nuevos Convenios

Para agregar un nuevo convenio:

1. Editar `server/database/init.js`
2. Agregar el convenio en la sección de INSERT:
```javascript
('NUEVO_CODIGO', 'Nombre del Convenio', 'Descripción')
```

3. Agregar categorías en el switch:
```javascript
case 'NUEVO_CODIGO':
  categorias = [
    { codigo: 'CAT1', nombre: 'Categoría 1', basico: 400000 },
    // más categorías...
  ];
  break;
```

4. Reiniciar el servidor

## 📞 Contacto

Para consultas sobre convenios, contactar con:
- Ministerio de Trabajo
- Sindicatos correspondientes
- Estudio contable

---

**Última actualización:** Los valores mostrados son ejemplos y deben actualizarse según normativa vigente.

