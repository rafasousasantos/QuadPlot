#!/bin/bash

echo "🔍 DIAGNÓSTICO DE ERROS - Complex Function Visualizer"
echo "=================================================="

# 1. Verificar processos na porta 5000
echo "📋 1. PROCESSOS NA PORTA 5000:"
lsof -ti:5000 2>/dev/null && {
    echo "❌ Porta 5000 está ocupada pelos processos:"
    lsof -i:5000
    echo ""
    echo "🔧 Para matar processos: kill -9 \$(lsof -ti:5000)"
} || {
    echo "✅ Porta 5000 está livre"
}

echo ""

# 2. Verificar se dist/index.js existe e se há erros de import
echo "📋 2. VERIFICAÇÃO DO BUILD DE PRODUÇÃO:"
if [ -f "dist/index.js" ]; then
    echo "✅ dist/index.js existe"
    
    # Verificar imports problemáticos
    echo "🔍 Verificando imports no build:"
    grep -n "import.*vite" dist/index.js 2>/dev/null && {
        echo "❌ PROBLEMA: Build contém imports de 'vite'"
    } || {
        echo "✅ Sem imports problemáticos de vite no build"
    }
    
    # Testar se o build roda
    echo "🔍 Testando execução do build:"
    timeout 3s node dist/index.js 2>&1 | head -5
    
else
    echo "❌ dist/index.js não existe - executar 'npm run build'"
fi

echo ""

# 3. Verificar dependências problemáticas
echo "📋 3. DEPENDÊNCIAS CRÍTICAS:"
echo "🔍 Vite está em dependencies:"
npm list vite 2>/dev/null && echo "✅ Vite encontrado" || echo "❌ Vite não encontrado"

echo "🔍 Nanoid está em dependencies:"
npm list nanoid 2>/dev/null && echo "✅ Nanoid encontrado" || echo "❌ Nanoid não encontrado"

echo ""

# 4. Verificar estrutura de arquivos
echo "📋 4. ESTRUTURA DE ARQUIVOS:"
echo "🔍 server/vite.ts:"
[ -f "server/vite.ts" ] && echo "✅ Existe" || echo "❌ Não existe"

echo "🔍 dist/public/ (frontend build):"
[ -d "dist/public" ] && {
    echo "✅ Existe"
    echo "   Arquivos: $(ls -la dist/public/ | wc -l) itens"
} || echo "❌ Não existe"

echo ""

# 5. Testar health endpoint na produção se servidor estiver rodando
echo "📋 5. TESTE DE PRODUÇÃO (se servidor estiver rodando):"
curl -s http://localhost:5013/api/health 2>/dev/null && {
    echo "✅ Health endpoint funcionando na porta 5013"
    curl -s http://localhost:5013/api/health | jq . 2>/dev/null || curl -s http://localhost:5013/api/health
} || {
    echo "❌ Servidor não está rodando na porta 5013"
}

echo ""

# 6. Verificar node_modules críticos
echo "📋 6. NODE_MODULES CRÍTICOS:"
[ -d "node_modules/vite" ] && echo "✅ node_modules/vite existe" || echo "❌ node_modules/vite não existe"
[ -d "node_modules/nanoid" ] && echo "✅ node_modules/nanoid existe" || echo "❌ node_modules/nanoid não existe"

echo ""
echo "🎯 RESUMO DOS PROBLEMAS ENCONTRADOS:"
echo "=================================================="

# Resumir problemas
problems=0

if lsof -ti:5000 >/dev/null 2>&1; then
    echo "❌ PROBLEMA 1: Porta 5000 ocupada (impede dev server)"
    echo "   SOLUÇÃO: kill -9 \$(lsof -ti:5000)"
    ((problems++))
fi

if ! [ -f "dist/index.js" ]; then
    echo "❌ PROBLEMA 2: Build de produção não existe"
    echo "   SOLUÇÃO: npm run build"
    ((problems++))
fi

if ! npm list vite >/dev/null 2>&1; then
    echo "❌ PROBLEMA 3: Vite não está nas dependencies"
    echo "   SOLUÇÃO: npm install vite"
    ((problems++))
fi

if [ $problems -eq 0 ]; then
    echo "✅ Nenhum problema crítico encontrado!"
    echo "🚀 O projeto deve estar funcionando corretamente"
fi

echo ""
echo "📝 Para aplicar todas as correções automaticamente, execute:"
echo "   ./fix-all-errors.sh"