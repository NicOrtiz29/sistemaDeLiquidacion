#!/bin/bash

echo "🚀 Iniciando Sistema de Liquidación de Sueldos..."
echo ""

# Verificar que las dependencias estén instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias del backend..."
    npm install
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Instalando dependencias del frontend..."
    cd client && npm install && cd ..
fi

echo ""
echo "✅ Dependencias instaladas"
echo ""
echo "Para iniciar el sistema:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd '/Users/nico/Copia Xubio' && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd '/Users/nico/Copia Xubio' && npm run client"
echo ""
echo "Luego abre: http://localhost:3000"
echo ""

