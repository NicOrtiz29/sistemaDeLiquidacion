# ⚡ Quick Start: Firebase Functions

## 🚀 Pasos Rápidos (5 minutos)

### 1. Instalar Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Login

```bash
firebase login
```

### 3. Crear Proyecto en Firebase

1. Ve a: https://console.firebase.google.com
2. "Add project"
3. Nombre: `sistema-liquidacion` (o el que prefieras)
4. Copia el **Project ID**

### 4. Configurar Proyecto

```bash
cd "/Users/nico/Copia Xubio"

# Editar .firebaserc - reemplazar "tu-proyecto-firebase" con tu Project ID
# Luego:
cd functions
npm install
cd ..
```

### 5. Desplegar

```bash
firebase deploy --only functions
```

### 6. Copiar URL y Configurar Netlify

Después del deploy, Firebase mostrará la URL. Será algo como:

```
https://us-central1-tu-proyecto.cloudfunctions.net/api
```

**En Netlify:**
1. Site settings → Environment variables
2. Agrega: `REACT_APP_API_URL` = `https://us-central1-tu-proyecto.cloudfunctions.net/api/api`
3. Redeploy

## ✅ Listo!

Tu backend está en Firebase Functions y tu frontend en Netlify.

---

**¿Problemas?** Revisa `DEPLOY-FIREBASE.md` para guía completa.

