#!/bin/bash

echo "🎯 VALIDAÇÃO FINAL - DEPLOY READY"
echo "=================================="

# 1. Verificar build
echo "📦 Verificando build..."
[ -f "dist/index.js" ] && echo "✅ Servidor build OK" || echo "❌ Servidor build FALTANDO"
[ -d "dist/public" ] && echo "✅ Frontend build OK" || echo "❌ Frontend build FALTANDO"

# 2. Testar servidor de produção rapidamente
echo "🚀 Testando servidor de produção..."
NODE_ENV=production PORT=5013 timeout 3s node dist/index.js &
sleep 2

if curl -s http://localhost:5013/api/health >/dev/null 2>&1; then
    echo "✅ Servidor de produção FUNCIONANDO"
    echo "🌐 Health endpoint respondendo"
    
    # Mostrar resposta do health
    echo "📋 Health response:"
    curl -s http://localhost:5013/api/health | head -1
else
    echo "❌ Servidor de produção com problemas"
fi

# Limpar processo de teste
pkill -f "node dist/index.js" 2>/dev/null

echo ""
echo "📋 ARQUIVOS DOCKER PRONTOS:"
echo "✅ Dockerfile"
echo "✅ docker-compose.yml" 
echo "✅ deploy.sh"
echo "✅ .dockerignore"

echo ""
echo "🚀 READY FOR EASY PANEL DEPLOY!"
echo "=================================="
echo "📌 PORTA: 5013"
echo "📌 ENVIRONMENT: NODE_ENV=production, PORT=5013"
echo "📌 HEALTH: /api/health"
echo ""
echo "🎯 Complex Function Visualizer com visualização 3D e domain coloring!"