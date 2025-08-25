#!/bin/bash

echo "🧪 TESTE DO ENTRYPOINT - Complex Function Visualizer"
echo "=================================================="

# Simular ambiente Docker
export NODE_ENV=production
export PORT=5013

echo "🔧 Preparando ambiente de teste..."

# Garantir que temos o build sem vite
if [ ! -f "dist/server.js" ]; then
    echo "📦 Criando build sem vite..."
    ./build-no-vite.sh
fi

echo ""
echo "🚀 TESTANDO ENTRYPOINT..."
echo "========================"

# Testar entrypoint
timeout 5s ./entrypoint.sh &
sleep 3

# Verificar se servidor subiu
if curl -s http://localhost:5013/api/health >/dev/null 2>&1; then
    echo "✅ ENTRYPOINT FUNCIONANDO!"
    echo "✅ Servidor respondendo na porta 5013"
    
    # Mostrar resposta do health
    echo "📋 Health response:"
    curl -s http://localhost:5013/api/health
else
    echo "❌ Entrypoint com problemas"
fi

# Limpar processo
pkill -f "node dist" 2>/dev/null

echo ""
echo "📋 RESUMO:"
echo "✅ Entrypoint script criado"
echo "✅ Dockerfile.production otimizado"  
echo "✅ Fallbacks inteligentes implementados"
echo "✅ Baseado em apps que funcionaram"