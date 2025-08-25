#!/bin/bash
# Complex Function Visualizer - Entrypoint Final
# Baseado em apps que funcionaram no EasyPanel

set -e

echo "🚀 Complex Function Visualizer - Starting..."
echo "Node.js version: $(node --version)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Usar diretório atual (funciona local e Docker)
WORKDIR="${PWD}"

# ESTRATÉGIA SIMPLES - Como apps que funcionaram
echo "🔧 Verificando e preparando aplicação..."

# 1. Tentar servidor limpo primeiro (mais confiável)
if [ -f "server-production.js" ]; then
    echo "✅ Usando servidor Express puro (método que funciona)"
    
    # Garantir frontend build
    if [ ! -d "dist/public" ]; then
        echo "📦 Building frontend..."
        npm run build 2>/dev/null || npx vite build
    fi
    
    # Copiar servidor limpo
    mkdir -p dist
    cp server-production.js dist/server.js
    
    echo "🚀 Starting clean Express server..."
    exec node dist/server.js
    
# 2. Fallback para build padrão (se servidor limpo não existir)
elif [ -f "dist/index.js" ]; then
    echo "⚡ Tentando build padrão..."
    
    # Verificar se tem problema vite
    if grep -q "vite\|@vitejs" dist/index.js 2>/dev/null; then
        echo "⚠️  Build padrão tem dependências vite - usando fallback"
        
        # Rebuild frontend
        npm run build 2>/dev/null || npx vite build
        
        # Usar servidor limpo como fallback
        cp server-production.js dist/server.js
        exec node dist/server.js
    else
        echo "🚀 Build padrão parece limpo - usando..."
        exec node dist/index.js
    fi

# 3. Último recurso - build completo
else
    echo "📦 Nenhum build encontrado - criando do zero..."
    
    # Build frontend
    npm run build 2>/dev/null || npx vite build
    
    # Sempre usar servidor limpo como padrão confiável
    mkdir -p dist
    cp server-production.js dist/server.js
    
    echo "🚀 Starting fresh clean server..."
    exec node dist/server.js
fi