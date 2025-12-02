#!/bin/bash

echo "🔥 Desplegando a Firebase Functions..."
echo ""

# Verificar que estamos en el directorio correcto
if [ ! -f "firebase.json" ]; then
    echo "❌ Error: No se encuentra firebase.json"
    echo "Asegúrate de estar en la raíz del proyecto"
    exit 1
fi

# Verificar que las dependencias están instaladas
if [ ! -d "functions/node_modules" ]; then
    echo "📦 Instalando dependencias de functions..."
    cd functions
    npm install
    cd ..
fi

# Verificar login
echo "🔐 Verificando login de Firebase..."
npx firebase-tools login --no-localhost

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Necesitas hacer login primero."
    echo "Ejecuta manualmente: npx firebase-tools login"
    exit 1
fi

# Verificar proyecto
echo ""
echo "📋 Verificando proyecto..."
npx firebase-tools use sistema-liquidacion-sueldos

# Desplegar
echo ""
echo "🚀 Desplegando functions..."
npx firebase-tools deploy --only functions

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ ¡Deploy exitoso!"
    echo ""
    echo "📝 Próximos pasos:"
    echo "1. Copia la URL de la función que aparece arriba"
    echo "2. Ve a Netlify → Site settings → Environment variables"
    echo "3. Actualiza REACT_APP_API_URL con: https://us-central1-sistema-liquidacion-sueldos.cloudfunctions.net/api/api"
    echo "4. Haz redeploy en Netlify"
else
    echo ""
    echo "❌ Error en el deploy. Revisa los mensajes arriba."
fi

