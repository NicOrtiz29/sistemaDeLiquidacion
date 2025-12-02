# 🤖 Deploy Automático - GitHub Actions

## 🎯 Configuración Completa

Ahora el sistema está configurado para deploy automático:

- ✅ **Netlify:** Deploy automático desde GitHub (ya configurado)
- ✅ **Firebase:** Deploy automático con GitHub Actions (nuevo)

## 🚀 Cómo Funciona

### Al hacer `git push`:

1. **Netlify detecta cambios** en `client/` y hace deploy automático
2. **GitHub Actions detecta cambios** en `server/` o `functions/` y despliega a Firebase

## ⚙️ Configuración Necesaria

### 1. Configurar Secretos en GitHub

Necesitas agregar un secreto para Firebase:

1. **Ve a tu repositorio en GitHub:**
   - https://github.com/NicOrtiz29/sistemaDeLiquidacion

2. **Settings** → **Secrets and variables** → **Actions**

3. **New repository secret:**
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** (ver siguiente sección)

### 2. Obtener Service Account de Firebase

#### Opción A: Desde Firebase Console

1. Ve a: https://console.firebase.google.com
2. Selecciona tu proyecto: `sistema-liquidacion-sueldos`
3. **Settings (⚙️)** → **Project settings**
4. **Service accounts** tab
5. Click en **Generate new private key**
6. Descarga el archivo JSON
7. **Copia TODO el contenido** del JSON
8. Pégalo como valor del secreto `FIREBASE_SERVICE_ACCOUNT` en GitHub

#### Opción B: Usar Firebase CLI (Más fácil)

```bash
cd "/Users/nico/Copia Xubio"

# Login si no lo has hecho
npx firebase-tools login:ci

# Esto te dará un token, pero mejor usa el método del JSON
```

### 3. Configurar Variable de Entorno en Netlify

1. **Ve a Netlify:** https://app.netlify.com
2. **Tu sitio** → **Site settings** → **Environment variables**
3. **Agrega o actualiza:**
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://us-central1-sistema-liquidacion-sueldos.cloudfunctions.net/api/api`

## ✅ Verificar que Funciona

### Test 1: Deploy Manual

Haz un cambio pequeño y push:

```bash
cd "/Users/nico/Copia Xubio"

# Hacer un cambio pequeño (ejemplo: agregar un comentario)
echo "# Test" >> README.md

git add .
git commit -m "Test deploy automático"
git push
```

### Test 2: Verificar Actions

1. Ve a: https://github.com/NicOrtiz29/sistemaDeLiquidacion/actions
2. Deberías ver workflows ejecutándose
3. Click en el workflow para ver el progreso

### Test 3: Verificar Deploys

- **Netlify:** Ve a tu sitio → Deploys (debería aparecer automáticamente)
- **Firebase:** Ve a Firebase Console → Functions → Logs

## 🔍 Troubleshooting

### GitHub Actions no se ejecuta

- Verifica que el archivo `.github/workflows/firebase-deploy.yml` existe
- Verifica que el secreto `FIREBASE_SERVICE_ACCOUNT` está configurado
- Revisa los logs en GitHub Actions

### Firebase deploy falla

- Verifica que el Service Account JSON es válido
- Verifica que el Project ID es correcto (`sistema-liquidacion-sueldos`)
- Revisa los logs en GitHub Actions

### Netlify no hace deploy

- Verifica que Netlify está conectado al repositorio
- Verifica que `netlify.toml` existe
- Ve a Netlify → Site settings → Build & deploy → verifica la configuración

## 📋 Workflows Configurados

### `firebase-deploy.yml`
- Se ejecuta cuando hay cambios en:
  - `server/**`
  - `functions/**`
  - `firebase.json`
  - `.firebaserc`
- Despliega a Firebase Functions

### `netlify-deploy.yml`
- Se ejecuta cuando hay cambios en:
  - `client/**`
  - `netlify.toml`
- Construye el frontend (Netlify lo despliega automáticamente)

## 🎯 Flujo Completo

```
git push
    ↓
GitHub recibe cambios
    ↓
┌─────────────────┬─────────────────┐
│                 │                 │
Netlify detecta   GitHub Actions    │
cambios en        detecta cambios   │
client/           en server/         │
    ↓                  ↓             │
Deploy automático Deploy a Firebase  │
a Netlify         Functions          │
    ↓                  ↓             │
Frontend listo    Backend listo     │
```

## ✅ Checklist

- [ ] Secret `FIREBASE_SERVICE_ACCOUNT` configurado en GitHub
- [ ] Variable `REACT_APP_API_URL` configurada en Netlify
- [ ] Netlify conectado al repositorio
- [ ] Hacer un push de prueba
- [ ] Verificar que ambos deploys funcionan

---

**¡Listo!** Ahora cada `git push` desplegará automáticamente tanto el frontend como el backend. 🚀

