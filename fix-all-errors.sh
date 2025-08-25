#!/bin/bash

echo "🔧 CORREÇÃO AUTOMÁTICA DE ERROS"
echo "================================="

# 1. Matar processos na porta 5000
echo "🔄 Liberando porta 5000..."
if lsof -ti:5000 >/dev/null 2>&1; then
    echo "Matando processos na porta 5000..."
    kill -9 $(lsof -ti:5000) 2>/dev/null
    sleep 2
    echo "✅ Porta 5000 liberada"
else
    echo "✅ Porta 5000 já estava livre"
fi

# 2. Garantir que vite e nanoid estão nas dependencies
echo "🔄 Verificando dependencies críticas..."
npm list vite >/dev/null 2>&1 || {
    echo "Instalando vite..."
    npm install vite
}

npm list nanoid >/dev/null 2>&1 || {
    echo "Instalando nanoid..."
    npm install nanoid
}

# 3. Fazer clean build
echo "🔄 Fazendo clean build..."
rm -rf dist/
npm run build

# 4. Testar servidor de produção na porta 5013
echo "🔄 Testando servidor de produção..."
NODE_ENV=production PORT=5013 timeout 5s node dist/index.js &
sleep 3

if curl -s http://localhost:5013/api/health >/dev/null 2>&1; then
    echo "✅ Servidor de produção funcionando na porta 5013!"
    echo "🌐 Health check: http://localhost:5013/api/health"
else
    echo "❌ Servidor de produção com problemas"
fi

# Matar o servidor de teste
pkill -f "node dist/index.js" 2>/dev/null

echo ""
echo "✅ CORREÇÕES APLICADAS!"
echo "🚀 Agora você pode:"
echo "   • Desenvolvimento: npm run dev"
echo "   • Produção: npm run start"
echo "   • Docker: docker build -t complex-function-visualizer ."