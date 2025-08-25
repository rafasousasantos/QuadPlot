#!/bin/bash

echo "🚀 BUILD SEM VITE - Production Ready"
echo "===================================="

# 1. Limpar build anterior
echo "🧹 Limpando builds anteriores..."
rm -rf dist/

# 2. Build do frontend com vite (apenas uma vez)
echo "📦 Building frontend..."
npx vite build

# 3. Criar estrutura sem dependência do server/vite.ts
echo "📦 Criando servidor de produção sem Vite..."

# Copiar servidor customizado
cp server-production.js dist/server.js

# Garantir que o diretório público existe
if [ ! -d "dist/public" ]; then
    echo "❌ Erro: dist/public não existe. Execute 'npx vite build' primeiro."
    exit 1
fi

echo "✅ Build sem Vite concluído!"
echo ""
echo "📁 Estrutura criada:"
echo "   • dist/server.js (servidor sem vite)"
echo "   • dist/public/ (frontend build)"
echo ""
echo "🚀 Para testar:"
echo "   NODE_ENV=production PORT=5013 node dist/server.js"