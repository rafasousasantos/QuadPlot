#!/bin/bash
set -e

echo "🚀 EasyPanel Deployment Build Script - VERSÃO FINAL"
echo "===================================================="

# Limpar builds anteriores
echo "🧹 Cleaning previous builds..."
rm -rf dist/

# Build frontend com config padrão (plugins desabilitados via REPL_ID)
echo "📦 Building frontend for production..."
NODE_ENV=production REPL_ID="" npx vite build

# Verificar se build frontend funcionou
if [ ! -f "dist/public/index.html" ]; then
    echo "❌ ERRO: Frontend build failed - index.html not found"
    exit 1
fi

# Copiar servidor CommonJS para produção
echo "🔧 Setting up production server..."
cp server-production.js dist/server.cjs

# Verificar se servidor foi copiado
if [ ! -f "dist/server.cjs" ]; then
    echo "❌ ERRO: Production server not copied"
    exit 1
fi

# Verificações de segurança
echo "🔍 Security checks..."

# Verificar se não há imports problemáticos do Vite no servidor
if grep -q "vite\|tsx\|@replit" dist/server.cjs 2>/dev/null; then
    echo "❌ ERRO: Production server contains development dependencies"
    exit 1
fi

# Verificar se frontend build não contém referências de desenvolvimento
if grep -r "localhost:500" dist/public/ 2>/dev/null; then
    echo "⚠️  WARNING: Frontend contains localhost references"
fi

# Teste local do servidor de produção
echo "🧪 Testing production server locally..."

# Limpar processos existentes na porta 5013
pkill -f "dist/server.cjs" 2>/dev/null || true
sleep 1

# Usar porta alternativa para teste (5014)
export PORT=5014

# Iniciar servidor em background
node dist/server.cjs &
SERVER_PID=$!

# Aguardar servidor iniciar
sleep 4

# Testar health endpoint
if curl -f http://localhost:5014/api/health >/dev/null 2>&1; then
    echo "✅ Health endpoint responding on port 5014"
else
    echo "❌ ERRO: Health endpoint not responding on port 5014"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Testar se frontend está sendo servido
if curl -f http://localhost:5014/ >/dev/null 2>&1; then
    echo "✅ Frontend being served"
else
    echo "❌ ERRO: Frontend not being served"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Parar servidor de teste
kill $SERVER_PID 2>/dev/null || true
sleep 1

# Restaurar variável de ambiente
unset PORT

# Relatório final
echo ""
echo "✅ BUILD SUCCESSFUL!"
echo "==================="
echo "📁 Frontend: dist/public/index.html"
echo "🚀 Server: dist/server.cjs"
echo "🐳 Dockerfile: Dockerfile.easypanel"
echo ""
echo "📋 Deploy Instructions:"
echo "1. Use Dockerfile.easypanel para o EasyPanel"
echo "2. Configure PORT=5013 no EasyPanel"
echo "3. Configure NODE_ENV=production"
echo "4. O health endpoint será: /api/health"
echo ""
echo "🔧 File sizes:"
ls -lh dist/public/index.html dist/server.cjs 2>/dev/null || true