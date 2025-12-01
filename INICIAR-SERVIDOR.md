# 🚀 Cómo Iniciar el Sistema - Solución Completa

## ❌ Problema: "ERR_CONNECTION_REFUSED"

Este error significa que el **servidor backend no está corriendo**. El frontend intenta conectarse pero no encuentra el servidor.

## ✅ Solución: Iniciar el Servidor Backend

### Paso 1: Abre una Terminal

Abre una terminal y ve al directorio del proyecto:

```bash
cd "/Users/nico/Copia Xubio"
```

### Paso 2: Inicia el Backend

```bash
npm run dev
```

O si no tienes nodemon:

```bash
node server/index.js
```

**Deberías ver:**
```
✅ Base de datos inicializada correctamente
✅ Categorías inicializadas correctamente
🚀 Servidor corriendo en puerto 5001
📊 Sistema de Liquidación de Sueldos iniciado
🌐 API disponible en http://localhost:5001/api
```

### Paso 3: Mantén esa Terminal Abierta

**¡IMPORTANTE!** No cierres esta terminal. El servidor debe seguir corriendo.

### Paso 4: Abre Otra Terminal para el Frontend

Abre una **segunda terminal**:

```bash
cd "/Users/nico/Copia Xubio"
npm run client
```

Esto abrirá automáticamente http://localhost:3000

## 🔍 Verificar que Funciona

1. **Backend funcionando:**
   - Abre: http://localhost:5001/api/health
   - Deberías ver: `{"status":"OK","message":"Sistema de Liquidación de Sueldos"}`

2. **Convenios cargados:**
   - Abre: http://localhost:5001/api/convenios
   - Deberías ver una lista de convenios en JSON

3. **Frontend funcionando:**
   - Abre: http://localhost:3000
   - Deberías ver el Dashboard

## ⚠️ Problemas Comunes

### Error: Puerto 5001 ocupado
```bash
# Ver qué está usando el puerto
lsof -i :5001

# Cambiar puerto en server/index.js línea 12
const PORT = process.env.PORT || 5002;
```

### Error: Base de datos no se crea
```bash
# Crear directorio manualmente
mkdir -p server/data

# Reinicializar base de datos
npm run reset-db
```

### Error: Módulos no encontrados
```bash
# Reinstalar dependencias
npm install
cd client && npm install && cd ..
```

## 📋 Resumen Rápido

**Terminal 1 - Backend:**
```bash
cd "/Users/nico/Copia Xubio"
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd "/Users/nico/Copia Xubio"
npm run client
```

**Navegador:**
- http://localhost:3000

## ✅ Todo Listo

Una vez que ambos servidores estén corriendo, deberías poder:
- ✅ Ver los convenios
- ✅ Ver los empleados
- ✅ Crear empleados
- ✅ Calcular liquidaciones

---

**¿El servidor no inicia?** Revisa los mensajes de error en la terminal del backend.

