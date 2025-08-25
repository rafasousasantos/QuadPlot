#!/bin/sh

# Complex Function Visualizer - Docker Entrypoint
# Baseado em apps que funcionaram em produção

echo "🚀 Complex Function Visualizer - Starting..."

# Verificar ambiente
echo "Node.js version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Environment: $NODE_ENV"
echo "Port: $PORT"

# Verificar se temos os diretórios necessários
echo "📦 Checking application structure..."

# Estratégia: tentar usar build otimizado primeiro, fallback para tsx
if [ -f "dist/server.js" ]; then
    echo "✅ Using optimized no-vite build..."
    echo "📁 Structure: dist/server.js + dist/public/"
    
    # Verificar se frontend existe
    if [ -d "dist/public" ]; then
        echo "✅ Frontend build found"
    else
        echo "❌ Frontend build missing - rebuilding..."
        npm run build
        # Copiar servidor sem vite
        cp server-production.js dist/server.js
    fi
    
    echo "🚀 Starting with clean Express server..."
    exec node dist/server.js
    
elif [ -f "dist/index.js" ]; then
    echo "⚡ Using standard build..."
    
    # Verificar se tem dependência do vite
    if grep -q "vite" dist/index.js; then
        echo "⚠️  Standard build has vite dependency"
        echo "📦 Rebuilding without vite..."
        
        # Rebuild sem vite
        npm run build:frontend
        cp server-production.js dist/server.js
        exec node dist/server.js
    else
        echo "🚀 Starting standard server..."
        exec node dist/index.js
    fi
    
else
    echo "📦 No build found - building application..."
    
    # Build completo
    npm run build
    
    # Usar servidor sem vite como fallback
    if [ ! -f "dist/index.js" ] || grep -q "vite" dist/index.js; then
        echo "🔧 Using no-vite fallback..."
        cp server-production.js dist/server.js
        exec node dist/server.js
    else
        exec node dist/index.js
    fi
fi