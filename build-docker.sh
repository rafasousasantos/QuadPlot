#!/bin/bash

echo "🔧 BUILD CUSTOMIZADO PARA DOCKER"
echo "================================="

# 1. Build do frontend
echo "📦 Building frontend..."
npm run --silent vite build

# 2. Build do servidor sem packages externos (bundle tudo)
echo "📦 Building servidor para produção..."
npx esbuild server/index.ts \
  --platform=node \
  --bundle \
  --format=esm \
  --outdir=dist \
  --define:process.env.NODE_ENV='"production"' \
  --external:fsevents

echo "✅ Build customizado concluído!"
echo "📁 Arquivos gerados:"
echo "   • dist/index.js (servidor)"
echo "   • dist/public/ (frontend)"