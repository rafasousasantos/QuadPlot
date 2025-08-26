#!/bin/bash
set -e

echo "🔧 Starting optimized build process..."

# Limpar builds anteriores
rm -rf dist/

# Build frontend usando config de produção
echo "📦 Building frontend with production config..."
NODE_ENV=production REPL_ID="" npx vite build --config vite.config.production.ts

# Build backend
echo "🔨 Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Copiar servidor de produção
echo "📋 Setting up production server..."
cp server-production.js dist/server.js

# Verificações
echo "🔍 Verifying build..."
if [ ! -f "dist/public/index.html" ]; then
    echo "❌ Frontend build failed - index.html not found"
    exit 1
fi

if [ ! -f "dist/server.js" ]; then
    echo "❌ Server setup failed - server.js not found"
    exit 1
fi

# Verificar se não há imports do Vite no código final
if grep -r "vite" dist/ 2>/dev/null; then
    echo "⚠️  Warning: Vite references found in build output"
else
    echo "✅ No Vite references in build - safe for production"
fi

echo "✅ Build completed successfully!"
echo "📁 Frontend files in: dist/public/"
echo "🚀 Production server: dist/server.js"