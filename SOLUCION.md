# 🔧 Solución al Problema de Localhost

## ✅ Cambios Realizados

1. **Puerto cambiado de 5000 a 5001** (el puerto 5000 estaba ocupado)
2. **Mejorada la inicialización del servidor** para esperar a la base de datos
3. **Dependencias ya instaladas** ✅

## 🚀 Cómo Iniciar Ahora

### Opción 1: Usando dos terminales (Recomendado)

**Terminal 1 - Backend:**
```bash
cd "/Users/nico/Copia Xubio"
npm run dev
```

Deberías ver:
```
🚀 Servidor corriendo en puerto 5001
📊 Sistema de Liquidación de Sueldos iniciado
🌐 API disponible en http://localhost:5001/api
✅ Base de datos inicializada correctamente
✅ Categorías inicializadas correctamente
```

**Terminal 2 - Frontend:**
```bash
cd "/Users/nico/Copia Xubio"
npm run client
```

Se abrirá automáticamente en: **http://localhost:3000**

### Opción 2: Script automático

Crea un archivo `iniciar.sh`:

```bash
#!/bin/bash
# Terminal 1
cd "/Users/nico/Copia Xubio"
npm run dev &
sleep 3
# Terminal 2
cd "/Users/nico/Copia Xubio"
npm run client
```

## 🌐 URLs del Sistema

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5001/api
- **Health Check:** http://localhost:5001/api/health

## ⚠️ Si Aún No Funciona

1. **Verifica que los puertos estén libres:**
   ```bash
   lsof -i :3000
   lsof -i :5001
   ```

2. **Reinstala dependencias si es necesario:**
   ```bash
   cd "/Users/nico/Copia Xubio"
   rm -rf node_modules package-lock.json
   npm install
   
   cd client
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Revisa los errores en la consola** cuando inicies el servidor

## 📝 Verificar que Funciona

1. Abre: http://localhost:5001/api/health
   - Deberías ver: `{"status":"OK","message":"Sistema de Liquidación de Sueldos"}`

2. Abre: http://localhost:3000
   - Deberías ver el Dashboard del sistema

## 🎯 Próximos Pasos

Una vez que el sistema esté corriendo:
1. Ve a "Empleados" y crea tu primer empleado
2. Ve a "Liquidación" y calcula una liquidación
3. Revisa el "Historial"

---

**Nota:** Si el puerto 5001 también está ocupado, puedes cambiarlo editando `server/index.js` línea 12:
```javascript
const PORT = process.env.PORT || 5002; // o cualquier otro puerto
```

