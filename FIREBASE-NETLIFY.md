# 🔥 Firebase + Netlify - Guía Completa

## 🎯 Arquitectura

```
Frontend (React)  →  Netlify
Backend (Express) →  Firebase Functions
Base de Datos     →  SQLite (temporal) / Firestore (recomendado)
```

## ✅ Ventajas de esta Configuración

- ✅ **Netlify:** Deploy automático desde GitHub, CDN global
- ✅ **Firebase Functions:** Serverless, escalable, gratis hasta cierto límite
- ✅ **Integración:** Ambos servicios funcionan bien juntos
- ✅ **Costo:** Plan gratuito suficiente para empezar

## 🚀 Pasos Completos

### Parte 1: Configurar Firebase

1. **Instalar Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Crear proyecto en Firebase Console:**
   - Ve a: https://console.firebase.google.com
   - "Add project"
   - Nombre: `sistema-liquidacion-sueldos`
   - Copia el **Project ID**

4. **Configurar proyecto local:**
   ```bash
   cd "/Users/nico/Copia Xubio"
   
   # Editar .firebaserc con tu Project ID
   # Reemplazar "tu-proyecto-firebase" con tu Project ID real
   ```

5. **Instalar dependencias:**
   ```bash
   cd functions
   npm install
   cd ..
   ```

6. **Desplegar:**
   ```bash
   firebase deploy --only functions
   ```

7. **Copiar la URL de la función:**
   - Será algo como: `https://us-central1-tu-proyecto.cloudfunctions.net/api`
   - La URL completa para el API es: `https://us-central1-tu-proyecto.cloudfunctions.net/api/api`

### Parte 2: Configurar Netlify

1. **Ve a Netlify:** https://app.netlify.com

2. **Configurar Build Settings:**
   - **Build command:** `cd client && npm install && npm run build`
   - **Publish directory:** `client/build`

3. **Agregar Variable de Entorno:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://us-central1-tu-proyecto.cloudfunctions.net/api/api`
   (Nota: tiene `/api` dos veces)

4. **Redeploy**

## 🔗 URLs Finales

- **Frontend:** `https://liquidacionessebi.netlify.app`
- **Backend API:** `https://us-central1-tu-proyecto.cloudfunctions.net/api/api`
- **Health Check:** `https://us-central1-tu-proyecto.cloudfunctions.net/api/api/health`

## 📋 Checklist

- [ ] Firebase CLI instalado
- [ ] Proyecto creado en Firebase Console
- [ ] `.firebaserc` configurado con Project ID
- [ ] Dependencias instaladas en `functions/`
- [ ] Functions desplegadas (`firebase deploy --only functions`)
- [ ] URL de Firebase copiada
- [ ] Variable `REACT_APP_API_URL` configurada en Netlify
- [ ] Netlify redeploy realizado
- [ ] Todo funciona correctamente

## ⚠️ Limitaciones Actuales

### Base de Datos SQLite

- Los datos pueden perderse entre invocaciones de Functions
- SQLite se guarda en `/tmp` (temporal)
- **Solución:** Migrar a Firestore (ver guía en `DEPLOY-FIREBASE.md`)

### Cold Starts

- La primera invocación puede ser lenta (~2-5 segundos)
- Las siguientes son rápidas
- Normal en serverless

## 🔄 Comandos Útiles

```bash
# Ver logs de Functions
firebase functions:log

# Probar localmente
firebase emulators:start --only functions

# Desplegar solo functions
firebase deploy --only functions

# Ver estado del proyecto
firebase projects:list
```

## 🎯 Próximos Pasos

1. **Migrar a Firestore** para persistencia real
2. **Agregar autenticación** con Firebase Auth
3. **Configurar dominio personalizado**
4. **Agregar monitoreo** con Firebase Analytics

---

**¿Necesitas ayuda?** Revisa `DEPLOY-FIREBASE.md` para detalles completos.

