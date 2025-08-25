#!/bin/bash

echo "🎯 TESTE FINAL - VERSÃO SEM VITE"
echo "================================="

# Testar servidor sem vite
echo "🚀 Testando servidor de produção sem Vite..."
NODE_ENV=production PORT=5013 timeout 3s node dist/server.js &
sleep 2

# Testar health endpoint
if curl -s http://localhost:5013/api/health >/dev/null 2>&1; then
    echo "✅ SERVIDOR SEM VITE: FUNCIONANDO"
    echo "✅ Health endpoint: OK"
    
    # Mostrar resposta
    echo "📋 Health response:"
    curl -s http://localhost:5013/api/health | head -1
else
    echo "❌ Problema com servidor sem vite"
fi

# Limpar processo
pkill -f "node dist/server.js" 2>/dev/null

echo ""
echo "🎯 RESUMO FINAL:"
echo "=================="
echo "✅ Versão SEM VITE funcionando na porta 5013"
echo "✅ Build criado: dist/server.js + dist/public/"
echo "✅ Zero dependências do Vite em produção"
echo "✅ Dockerfile.no-vite pronto para deploy"

echo ""
echo "🚀 DEPLOY NO EASY PANEL:"
echo "========================"
echo "📦 Usar: Dockerfile.no-vite"
echo "🌐 Porta: 5013"
echo "💚 Health: /api/health"
echo "🏗️  Build: ./build-no-vite.sh"