# 🔥 Desplegar Backend en Firebase Functions

## 📋 Resumen

Este proyecto ahora está configurado para usar:
- **Frontend:** Netlify (ya configurado)
- **Backend:** Firebase Functions (Cloud Functions)

## 🚀 Pasos para Desplegar

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Iniciar Sesión en Firebase

```bash
firebase login
```

Esto abrirá tu navegador para autenticarte con Google.

### 3. Crear Proyecto en Firebase Console

1. Ve a: https://console.firebase.google.com
2. Click en "Add project" o "Crear proyecto"
3. Nombre del proyecto: `sistema-liquidacion-sueldos` (o el que prefieras)
4. Sigue los pasos (puedes desactivar Google Analytics si quieres)
5. Una vez creado, copia el **Project ID**

### 4. Configurar el Proyecto Local

```bash
cd "/Users/nico/Copia Xubio"

# Inicializar Firebase (si es la primera vez)
firebase init functions

# O simplemente actualizar el .firebaserc con tu Project ID
```

Edita `.firebaserc` y reemplaza `tu-proyecto-firebase` con tu Project ID real:

```json
{
  "projects": {
    "default": "tu-project-id-real"
  }
}
```

### 5. Instalar Dependencias de Functions

```bash
cd functions
npm install
cd ..
```

### 6. Probar Localmente (Opcional)

```bash
# Iniciar emulador de Firebase Functions
firebase emulators:start --only functions

# En otra terminal, probar:
curl http://localhost:5001/tu-proyecto/us-central1/api/api/health
```

### 7. Desplegar a Firebase

```bash
# Desde la raíz del proyecto
firebase deploy --only functions
```

Esto puede tardar varios minutos la primera vez.

### 8. Obtener la URL de tu API

Después del deploy, Firebase te mostrará la URL. Será algo como:

```
https://us-central1-tu-proyecto.cloudfunctions.net/api
```

**IMPORTANTE:** La URL completa incluye `/api` al final para las rutas:
- Health check: `https://us-central1-tu-proyecto.cloudfunctions.net/api/api/health`
- Empleados: `https://us-central1-tu-proyecto.cloudfunctions.net/api/api/empleados`

### 9. Configurar Netlify con la URL de Firebase

1. Ve a Netlify: https://app.netlify.com
2. Selecciona tu sitio
3. Ve a **Site settings** → **Environment variables**
4. Actualiza o agrega:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://us-central1-tu-proyecto.cloudfunctions.net/api/api`
   (Nota: tiene `/api` dos veces - uno de la función y otro de las rutas)

5. **Redeploy** el sitio

## 🔧 Estructura de Archivos

```
.
├── functions/
│   ├── index.js          # Cloud Function principal
│   ├── package.json      # Dependencias de Functions
│   └── .gitignore
├── server/               # Código compartido (rutas, servicios)
├── firebase.json         # Configuración de Firebase
└── .firebaserc          # Project ID de Firebase
```

## 📝 Notas Importantes

### Base de Datos SQLite en Firebase

- Firebase Functions usa `/tmp` para archivos temporales
- La base de datos se crea en `/tmp/liquidacion.db`
- **IMPORTANTE:** Los datos pueden perderse entre invocaciones
- Para producción, considera migrar a **Firestore** (base de datos de Firebase)

### CORS

Ya está configurado para permitir requests desde Netlify.

### Rutas

Las rutas funcionan igual que antes:
- `/api/empleados`
- `/api/liquidacion`
- `/api/convenios`
- `/api/recibos`
- `/api/health`

## 🔍 Verificar el Deploy

### Health Check

```bash
curl https://us-central1-tu-proyecto.cloudfunctions.net/api/api/health
```

Debería responder:
```json
{"status":"OK","message":"Sistema de Liquidación de Sueldos - Firebase Functions"}
```

### Ver Logs

```bash
firebase functions:log
```

O en Firebase Console:
1. Ve a Firebase Console
2. Functions → Logs

## 🐛 Solución de Problemas

### Error: "Functions directory does not exist"

```bash
# Asegúrate de estar en la raíz del proyecto
cd "/Users/nico/Copia Xubio"
```

### Error: "Permission denied"

```bash
# Verifica que estás logueado
firebase login

# Verifica el proyecto
firebase use --add
```

### Error: "Module not found"

```bash
# Instala dependencias en functions
cd functions
npm install
cd ..
```

### La base de datos no persiste

Esto es normal en Firebase Functions. Considera:
1. Migrar a Firestore (recomendado para producción)
2. Usar Cloud SQL
3. Usar otro servicio de base de datos

## 🎯 Próximos Pasos Recomendados

1. **Migrar a Firestore** para persistencia de datos
2. **Configurar autenticación** con Firebase Auth
3. **Agregar seguridad** a las Cloud Functions
4. **Configurar dominio personalizado** en Firebase

## 📚 Recursos

- **Firebase Docs:** https://firebase.google.com/docs/functions
- **Firebase Console:** https://console.firebase.google.com
- **Firebase CLI:** https://firebase.google.com/docs/cli

---

**¡Listo!** Tu backend ahora está en Firebase Functions y el frontend en Netlify. 🚀

