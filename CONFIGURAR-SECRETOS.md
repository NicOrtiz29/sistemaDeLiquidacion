# 🔐 Configurar Secretos para Deploy Automático

## 📋 Secretos Necesarios

Para que el deploy automático funcione, necesitas configurar estos secretos en GitHub:

### 1. FIREBASE_TOKEN

Este es el más fácil de obtener:

#### Opción A: Desde Terminal (Recomendado)

```bash
cd "/Users/nico/Copia Xubio"

# Login y obtener token
npx firebase-tools login:ci
```

Esto te mostrará un token. **Cópialo.**

#### Opción B: Desde Firebase Console

1. Ve a: https://console.firebase.google.com
2. Settings → Users and permissions
3. Generar token de acceso

### 2. Agregar el Secreto en GitHub

1. **Ve a tu repositorio:**
   - https://github.com/NicOrtiz29/sistemaDeLiquidacion

2. **Settings** → **Secrets and variables** → **Actions**

3. **New repository secret**

4. **Agrega:**
   - **Name:** `FIREBASE_TOKEN`
   - **Value:** (el token que copiaste arriba)

5. **Add secret**

## ✅ Verificar Configuración

### Test Rápido

```bash
cd "/Users/nico/Copia Xubio"

# Hacer un cambio pequeño
echo "# Test automático" >> README.md

git add .
git commit -m "Test deploy automático"
git push
```

Luego:
1. Ve a: https://github.com/NicOrtiz29/sistemaDeLiquidacion/actions
2. Deberías ver un workflow ejecutándose
3. Si todo está bien, verás "Deploy to Firebase Functions" ejecutándose

## 🔍 Si Hay Problemas

### Error: "FIREBASE_TOKEN not found"

- Verifica que el secreto está configurado en GitHub
- Verifica que el nombre es exactamente `FIREBASE_TOKEN`
- Verifica que el token es válido (puedes regenerarlo con `firebase login:ci`)

### Error: "Project not found"

- Verifica que el Project ID en `.firebaserc` es correcto
- Verifica que tienes permisos en el proyecto de Firebase

---

**Una vez configurado, cada push desplegará automáticamente a Firebase.** 🚀

