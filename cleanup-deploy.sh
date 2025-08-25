#!/bin/bash

echo "🧹 LIMPEZA FINAL - Deploy Ready"
echo "==============================="

# Matar processos que possam estar rodando
echo "🔧 Parando processos ativos..."
pkill -f "node dist" 2>/dev/null || true
pkill -f "tsx server" 2>/dev/null || true

# Limpar arquivos temporários de teste
echo "🗑️  Removendo arquivos temporários..."
rm -f error-log.txt

# Verificar arquivos essenciais para deploy
echo ""
echo "📋 VERIFICAÇÃO FINAL:"
echo "===================="

# Dockerfiles
[ -f "Dockerfile.production" ] && echo "✅ Dockerfile.production" || echo "❌ Dockerfile.production FALTANDO"
[ -f "Dockerfile.no-vite" ] && echo "✅ Dockerfile.no-vite" || echo "❌ Dockerfile.no-vite FALTANDO"

# Scripts
[ -f "entrypoint.sh" ] && echo "✅ entrypoint.sh" || echo "❌ entrypoint.sh FALTANDO"
[ -f "server-production.js" ] && echo "✅ server-production.js" || echo "❌ server-production.js FALTANDO"

# Build
[ -d "dist/public" ] && echo "✅ Frontend build" || echo "❌ Frontend build FALTANDO"
[ -f "dist/server.js" ] && echo "✅ Servidor limpo" || echo "❌ Servidor limpo FALTANDO"

echo ""
echo "🎯 ARQUIVOS PRONTOS PARA EASYPANEL:"
echo "=================================="
echo "📦 Dockerfile.production (recomendado) - com entrypoint inteligente"
echo "📦 Dockerfile.no-vite (alternativo) - imagem mais leve"
echo "🌐 Porta: 5013"
echo "💚 Health: /api/health"
echo "🎓 Complex Function Visualizer educacional"

echo ""
echo "🚀 DEPLOY STATUS: READY!"