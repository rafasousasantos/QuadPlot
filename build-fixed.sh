#!/bin/bash

echo "🔧 BUILD CORRIGIDO - SEM VITE EM PRODUÇÃO"
echo "========================================"

# Limpar build anterior
echo "🧹 Limpando build anterior..."
rm -rf dist/

# Build do frontend 
echo "📦 Building frontend..."
npm run build

# Build do servidor CORRIGIDO - excluindo vite
echo "🛠️  Building servidor sem dependências vite..."
npx esbuild server/index-fixed.ts \
  --platform=node \
  --packages=external \
  --bundle \
  --format=esm \
  --outfile=dist/index.js \
  --external:vite \
  --external:@vitejs/* \
  --external:./vite \
  --target=node20

echo "✅ Build corrigido concluído!"
echo ""
echo "📁 Estrutura criada:"
echo "   • dist/index.js (servidor SEM vite bundled)"
echo "   • dist/public/ (frontend build)"
echo ""
echo "🧪 Para testar:"
echo "   NODE_ENV=production PORT=5013 node dist/index.js"