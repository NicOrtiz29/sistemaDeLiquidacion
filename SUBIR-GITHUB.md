# 🚀 Subir Proyecto a GitHub - Guía

## ✅ Pasos Completados

1. ✅ Git inicializado
2. ✅ Archivos agregados al staging
3. ✅ Commit inicial realizado
4. ✅ Branch renombrado a `main`
5. ✅ Remote agregado

## 🔄 Último Paso: Push al Repositorio

Ejecuta este comando para subir tu código:

```bash
cd "/Users/nico/Copia Xubio"
git push -u origin main
```

Si es la primera vez que haces push a este repositorio, GitHub puede pedirte autenticación.

## 🔐 Opciones de Autenticación

### Opción 1: Usando Personal Access Token (Recomendado)

1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Genera un nuevo token con permisos `repo`
3. Usa el token como contraseña cuando git te lo pida

### Opción 2: Usando SSH

Si ya tienes SSH configurado:

```bash
git remote set-url origin git@github.com:NicOrtiz29/sistemaDeLiquidacion.git
git push -u origin main
```

## 📋 Comandos Completos

```bash
# Si ya ejecutaste los pasos anteriores, solo necesitas:
cd "/Users/nico/Copia Xubio"
git push -u origin main
```

Si necesitas hacerlo desde cero:

```bash
cd "/Users/nico/Copia Xubio"

# Inicializar git (ya hecho)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: Sistema de Liquidación de Sueldos con 30 convenios colectivos"

# Renombrar branch a main
git branch -M main

# Agregar remote
git remote add origin https://github.com/NicOrtiz29/sistemaDeLiquidacion.git

# Push
git push -u origin main
```

## ✅ Verificar

Después del push, ve a:
https://github.com/NicOrtiz29/sistemaDeLiquidacion

Deberías ver todos tus archivos subidos.

## 🔄 Próximos Commits

Para futuros cambios:

```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

---

**¿Problemas?** Revisa los mensajes de error de git o consulta la documentación de GitHub.

