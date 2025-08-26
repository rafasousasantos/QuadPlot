#!/bin/bash
set -e

echo "🚀 EasyPanel Build Script - Express v5 Compatible"
echo "=================================================="
echo "✅ Corrigido: TypeError Missing parameter name (path-to-regexp)"

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

# Verificações de segurança e Express v5
echo "🔍 Security checks and Express v5 compatibility..."

# Verificar se não há imports problemáticos do Vite no servidor
if grep -q "vite\|tsx\|@replit" dist/server.cjs 2>/dev/null; then
    echo "❌ ERRO: Production server contains development dependencies"
    exit 1
fi

# Verificar se as rotas wildcard foram corrigidas para Express v5
if grep -q "app\\.get('\\*'" server-production.js 2>/dev/null; then
    echo "❌ ERRO: Found Express v4 wildcard routes that need fixing"
    echo "   Use app.get('/*path') instead of app.get('*')"
    exit 1
fi

if grep -q "app\\.get('/*path'" server-production.js 2>/dev/null; then
    echo "✅ Express v5 wildcard routes correctly implemented"
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
echo "✅ BUILD SUCCESSFUL - Express v5 & npm v10 Compatible!"
echo "===================================================="
echo "📁 Frontend: dist/public/index.html"
echo "🚀 Server: dist/server.js (Express v5 wildcard routes fixed)"
echo "🐳 Dockerfile: Dockerfile (npm v10.8+ compatible)"
echo ""
echo "📋 Deploy Instructions para EasyPanel:"
echo "1. Use Dockerfile principal (corrigido para npm v10+)"
echo "2. Configure PORT=5013 no EasyPanel"
echo "3. Configure NODE_ENV=production e REPL_ID=\"\""
echo "4. Health endpoint: /api/health"
echo ""
echo "🔧 Problema Resolvido:"
echo "  ❌ ERR_MODULE_NOT_FOUND (Vite) → ✅ Separação dev/prod"
echo "  ❌ TypeError Missing parameter name → ✅ Express v5 routes /*path"
echo "  ❌ npm ci --only=production → ✅ npm install express --production"
echo ""
echo "🔧 File sizes:"
ls -lh dist/public/index.html dist/server.cjs 2>/dev/null || true