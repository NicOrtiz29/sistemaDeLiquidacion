# 🔧 Solución: Error "ERR_CONNECTION_REFUSED"

## ❌ Problema

Cuando ves este error en la consola del navegador:
```
GET http://localhost:5001/api/convenios net::ERR_CONNECTION_REFUSED
AxiosError: Network Error
```

Significa que el **servidor backend no está corriendo**.

## ✅ Solución Rápida

### Paso 1: Abre una Terminal

### Paso 2: Ve al Directorio del Proyecto

```bash
cd "/Users/nico/Copia Xubio"
```

### Paso 3: Inicia el Servidor Backend

```bash
npm run dev
```

**O si no funciona:**

```bash
node server/index.js
```

### Paso 4: Espera a Ver Este Mensaje

Deberías ver:
```
✅ Base de datos inicializada correctamente
✅ Categorías inicializadas correctamente
🚀 Servidor corriendo en puerto 5001
📊 Sistema de Liquidación de Sueldos iniciado
🌐 API disponible en http://localhost:5001/api
```

### Paso 5: ¡Listo!

Ahora:
1. **No cierres esa terminal** (el servidor debe seguir corriendo)
2. Recarga la página en el navegador (F5 o Cmd+R)
3. Todo debería funcionar

## 🔍 Verificar que Funciona

### Opción 1: Probar el Health Check

Abre en tu navegador:
```
http://localhost:5001/api/health
```

Deberías ver:
```json
{"status":"OK","message":"Sistema de Liquidación de Sueldos"}
```

### Opción 2: Ver los Convenios

Abre:
```
http://localhost:5001/api/convenios
```

Deberías ver una lista de convenios en JSON.

### Opción 3: Verificar en la App

1. Recarga http://localhost:3000
2. Ve a "Convenios" en el menú
3. Deberías ver los 30 convenios

## ⚠️ Importante

**El servidor backend debe estar corriendo SIEMPRE** mientras uses la aplicación web.

- ✅ Si el backend está corriendo → La aplicación funciona
- ❌ Si el backend NO está corriendo → Verás errores de conexión

## 🔄 Proceso Completo

**Terminal 1 - Backend (Mantener abierta):**
```bash
cd "/Users/nico/Copia Xubio"
npm run dev
```

**Terminal 2 - Frontend (Opcional, si no se abrió automáticamente):**
```bash
cd "/Users/nico/Copia Xubio"
npm run client
```

**Navegador:**
- http://localhost:3000

## 🐛 Problemas Comunes

### El servidor no inicia

**Verifica:**
1. ¿Estás en el directorio correcto?
   ```bash
   pwd
   # Debe mostrar: /Users/nico/Copia Xubio
   ```

2. ¿Están instaladas las dependencias?
   ```bash
   ls node_modules
   # Debe mostrar una carpeta
   ```

3. Si no, instala:
   ```bash
   npm install
   ```

### Puerto 5001 ocupado

**Verifica qué está usando el puerto:**
```bash
lsof -i :5001
```

**Cambia el puerto:**
Edita `server/index.js` línea 12:
```javascript
const PORT = process.env.PORT || 5002;
```

Y también `client/src/services/api.js` línea 3:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002/api';
```

### La base de datos no se crea

**Crea el directorio manualmente:**
```bash
mkdir -p server/data
```

**Luego reinicia el servidor:**
```bash
npm run dev
```

## 📝 Resumen

1. ✅ Abre terminal
2. ✅ `cd "/Users/nico/Copia Xubio"`
3. ✅ `npm run dev`
4. ✅ Espera a que inicie
5. ✅ Recarga el navegador
6. ✅ ¡Listo!

---

**¿Todavía no funciona?** Comparte el mensaje de error completo que aparece en la terminal del backend.

