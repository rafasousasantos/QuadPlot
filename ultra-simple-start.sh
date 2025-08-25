#!/bin/bash

echo "🚀 ULTRA SIMPLE START - Complex Function Visualizer"
echo "=================================================="
echo "Método mais simples possível - como apps que funcionaram"

export NODE_ENV=production
export PORT=5013

echo ""
echo "📦 Preparando servidor..."

# Garantir que temos frontend build
if [ ! -d "dist/public" ]; then
    echo "Building frontend..."
    npx vite build
fi

# Usar SEMPRE o servidor Express puro
echo "🔧 Usando servidor Express puro (zero problemas vite)..."
mkdir -p dist
cp server-production.js dist/server.js

echo "✅ Estrutura preparada:"
echo "   • dist/server.js (Express puro)"
echo "   • dist/public/ (Frontend)"

echo ""
echo "🚀 Starting server..."
NODE_ENV=production PORT=5013 node dist/server.js