# 🚀 Guía de Instalación Rápida

## Paso 1: Instalar Dependencias

Ejecuta este comando para instalar todas las dependencias:

```bash
npm install
cd client && npm install && cd ..
```

O usa el script automatizado:

```bash
npm run install-all
```

## Paso 2: Iniciar el Sistema

### Opción A: Desarrollo (Recomendado)

Terminal 1 - Backend:
```bash
npm run dev
```

Terminal 2 - Frontend:
```bash
npm run client
```

### Opción B: Producción

Terminal 1 - Backend:
```bash
npm start
```

Terminal 2 - Frontend:
```bash
cd client && npm start && cd ..
```

## Paso 3: Acceder a la Aplicación

Abre tu navegador en: **http://localhost:3000**

El backend estará corriendo en: **http://localhost:5000**

## ✅ Verificar Instalación

1. La base de datos se creará automáticamente en `server/data/liquidacion.db`
2. Los convenios y categorías se cargarán automáticamente
3. Verás el panel de control con estadísticas

## 🎯 Primeros Pasos

1. **Ir a "Empleados"** y agregar tu primer empleado
2. **Seleccionar un convenio** (Textil, Comercio, etc.)
3. **Ir a "Liquidación"** y calcular la primera liquidación
4. **Revisar el "Historial"** para ver las liquidaciones guardadas

## ⚠️ Notas Importantes

- Los valores de sueldos básicos están configurados como ejemplo
- **Debes actualizar los valores** según los convenios vigentes
- Los porcentajes de descuentos están actualizados para 2024
- Revisa la normativa vigente antes de usar en producción

## 🔧 Solución de Problemas

### Error: Puerto 5000 en uso
```bash
# Cambiar puerto del backend en server/index.js
PORT=5001 npm start
```

### Error: Puerto 3000 en uso
```bash
# Cambiar puerto del frontend
PORT=3001 npm run client
```

### Error de base de datos
```bash
# Eliminar y recrear
rm server/data/liquidacion.db
npm start
```

## 📚 Próximos Pasos

- Configurar valores reales de convenios
- Agregar más empleados
- Realizar liquidaciones de prueba
- Configurar backups de la base de datos

---

¡Listo! Ya puedes comenzar a usar el sistema. 🎉

