# 🚀 Desplegar en Netlify - Guía Completa

## ⚠️ Importante: Backend Separado Necesario

**Netlify solo sirve el frontend (React)**. Necesitas desplegar el backend en otro servicio como:
- **Railway** (recomendado, gratis)
- **Render** (recomendado, gratis)
- **Heroku** (pago después de prueba)
- **Vercel** (para funciones serverless)

## 📋 Pasos para Desplegar en Netlify

### 1. Preparar el Proyecto

Los archivos de configuración ya están creados:
- ✅ `netlify.toml` - Configuración de build
- ✅ `client/public/_redirects` - Para React Router

### 2. Desplegar el Backend Primero

**Opción A: Railway (Recomendado - Gratis)**

1. Ve a: https://railway.app
2. Inicia sesión con GitHub
3. Click en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Selecciona tu repositorio
6. Configura:
   - **Root Directory:** `server`
   - **Build Command:** (vacío)
   - **Start Command:** `node index.js`
7. Agrega variable de entorno:
   - `PORT` = (Railway lo asigna automáticamente)
8. Railway te dará una URL como: `https://tu-app.railway.app`

**Opción B: Render (Gratis)**

1. Ve a: https://render.com
2. Inicia sesión con GitHub
3. Click en "New +" → "Web Service"
4. Conecta tu repositorio
5. Configura:
   - **Name:** `liquidacion-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Plan:** Free
6. Render te dará una URL

### 3. Desplegar el Frontend en Netlify

#### Método 1: Desde GitHub (Recomendado)

1. **Ve a Netlify:**
   - https://app.netlify.com
   - Inicia sesión con GitHub

2. **Add new site → Import an existing project**

3. **Conecta tu repositorio:**
   - Selecciona `NicOrtiz29/sistemaDeLiquidacion`

4. **Configura el build:**
   - **Base directory:** (vacío)
   - **Build command:** `cd client && npm install && npm run build`
   - **Publish directory:** `client/build`

5. **Agrega Variable de Entorno:**
   - Click en "Show advanced"
   - Click en "New variable"
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://tu-backend-url.railway.app/api` (o tu URL de Render)

6. **Deploy site**

#### Método 2: Arrastrar y Soltar

1. **Construye el proyecto localmente:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Arrastra la carpeta `client/build` a Netlify**

### 4. Configurar Variables de Entorno en Netlify

Después del deploy inicial:

1. Ve a tu sitio en Netlify
2. Click en **Site settings**
3. Click en **Environment variables**
4. Agrega:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://tu-backend-url.railway.app/api`

5. **Redeploy** el sitio para aplicar cambios

## 🔧 Configuración Actual

### Archivos Ya Creados:

- ✅ `netlify.toml` - Configuración automática de build
- ✅ `client/public/_redirects` - Para React Router

### Estructura:

```
netlify.toml          → Configuración de Netlify
client/
  public/
    _redirects        → Redirects para SPA
  build/              → (Se genera al hacer build)
```

## 📝 Verificar el Deploy

### Frontend (Netlify):
- ✅ Debería cargar en: `https://liquidacionessebi.netlify.app`
- ✅ Las rutas deberían funcionar (/, /empleados, /liquidacion, etc.)

### Backend (Railway/Render):
- ✅ Health check: `https://tu-backend.railway.app/api/health`
- ✅ Debería responder: `{"status":"OK",...}`

## 🔍 Solución de Problemas

### Error 404 en Netlify

**Problema:** Las rutas de React Router dan 404

**Solución:**
- Verifica que el archivo `client/public/_redirects` existe
- Verifica que `netlify.toml` tiene la configuración de redirects
- Hacer redeploy después de agregar estos archivos

### Error: "Cannot GET /api/..."

**Problema:** El frontend no puede conectarse al backend

**Solución:**
1. Verifica que el backend está corriendo (haz un health check)
2. Verifica la variable de entorno `REACT_APP_API_URL` en Netlify
3. Asegúrate de que la URL incluye `/api` al final
4. Verifica CORS en el backend (ya está configurado)

### Error: Build Failed

**Problema:** El build falla en Netlify

**Solución:**
- Revisa los logs de build en Netlify
- Verifica que todas las dependencias están en `package.json`
- Asegúrate de que el build funciona localmente primero:
  ```bash
  cd client
  npm install
  npm run build
  ```

## 🎯 Checklist Final

Antes de hacer deploy:

- [ ] Backend desplegado (Railway/Render)
- [ ] URL del backend funcionando
- [ ] `netlify.toml` configurado
- [ ] `client/public/_redirects` existe
- [ ] Variable de entorno `REACT_APP_API_URL` configurada en Netlify
- [ ] Build funciona localmente

## 📚 Recursos

- **Netlify Docs:** https://docs.netlify.com
- **Railway Docs:** https://docs.railway.app
- **Render Docs:** https://render.com/docs

---

**¿Necesitas ayuda?** Revisa los logs de deploy en Netlify para ver errores específicos.

