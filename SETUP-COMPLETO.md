# ✅ Setup Completo - Deploy Automático

## 🎉 ¡Todo Configurado!

El sistema ahora tiene **deploy automático completo**:

- ✅ **Netlify:** Deploy automático desde GitHub (ya funcionando)
- ✅ **Firebase:** Deploy automático con GitHub Actions (configurado)

## 🚀 Cómo Funciona

Cada vez que hagas `git push`:

1. **Netlify detecta cambios** en `client/` → Deploy automático
2. **GitHub Actions detecta cambios** en `server/` o `functions/` → Deploy a Firebase

## ⚙️ Último Paso: Configurar Secreto de Firebase

Para que Firebase se despliegue automáticamente, necesitas un token:

### Paso 1: Obtener Token de Firebase

```bash
cd "/Users/nico/Copia Xubio"
npx firebase-tools login:ci
```

Esto te mostrará un token. **Cópialo.**

### Paso 2: Agregar Secreto en GitHub

1. Ve a: https://github.com/NicOrtiz29/sistemaDeLiquidacion/settings/secrets/actions
2. Click en **"New repository secret"**
3. **Name:** `FIREBASE_TOKEN`
4. **Value:** (pega el token que copiaste)
5. Click **"Add secret"**

### Paso 3: Configurar Variable en Netlify

1. Ve a: https://app.netlify.com
2. Tu sitio → **Site settings** → **Environment variables**
3. Agrega/actualiza:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `https://us-central1-sistema-liquidacion-sueldos.cloudfunctions.net/api/api`

## ✅ Probar que Funciona

```bash
cd "/Users/nico/Copia Xubio"

# Hacer un cambio pequeño
echo "# Deploy automático funcionando" >> README.md

git add .
git commit -m "Test deploy automático"
git push
```

Luego verifica:

1. **GitHub Actions:**
   - Ve a: https://github.com/NicOrtiz29/sistemaDeLiquidacion/actions
   - Deberías ver "Deploy to Firebase Functions" ejecutándose

2. **Netlify:**
   - Ve a tu sitio en Netlify
   - Deploys → Debería aparecer un nuevo deploy automático

3. **Firebase:**
   - Ve a: https://console.firebase.google.com
   - Functions → Deberías ver la función actualizada

## 📋 Archivos Creados

- ✅ `.github/workflows/firebase-deploy.yml` - Workflow para Firebase
- ✅ `.github/workflows/netlify-deploy.yml` - Workflow para Netlify (opcional)
- ✅ `DEPLOY-AUTOMATICO.md` - Guía completa
- ✅ `CONFIGURAR-SECRETOS.md` - Cómo configurar secretos

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
client/           en server/        │
    ↓                  ↓             │
Deploy automático Deploy a Firebase  │
a Netlify         Functions          │
    ↓                  ↓             │
✅ Frontend listo  ✅ Backend listo  │
```

## 🔍 Troubleshooting

### GitHub Actions no se ejecuta

- Verifica que el secreto `FIREBASE_TOKEN` está configurado
- Verifica que el workflow existe en `.github/workflows/`
- Revisa los logs en GitHub Actions

### Firebase deploy falla

- Verifica que el token es válido
- Verifica que el Project ID es correcto
- Revisa los logs en GitHub Actions

---

**¡Listo!** Una vez que agregues el secreto `FIREBASE_TOKEN`, todo será automático. 🚀

