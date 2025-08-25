#!/bin/bash

echo "🔍 CAPTURA DE ERRO DETALHADO"
echo "============================"

echo "📋 Tentando executar servidor de produção e capturar erro completo..."
echo ""

# Executar com logs detalhados
NODE_ENV=production PORT=5013 node dist/index.js 2>&1 | tee error-log.txt &
SERVER_PID=$!

# Aguardar um pouco para capturar o erro
sleep 3

# Matar o processo se ainda estiver rodando
kill $SERVER_PID 2>/dev/null

echo ""
echo "📝 ERRO CAPTURADO:"
echo "=================="
cat error-log.txt

echo ""
echo "💡 ANÁLISE DO ERRO:"
echo "=================="

if grep -q "ERR_MODULE_NOT_FOUND.*vite\|Cannot find package 'vite'" error-log.txt; then
    echo "❌ PROBLEMA: Servidor de produção tentando importar 'vite'"
    echo "🔧 CAUSA: server/vite.ts está sendo incluído no build de produção"
    echo "💡 EXPLICAÇÃO: O build atual inclui código do Vite que não deveria estar na produção"
    echo ""
    echo "✅ SOLUÇÕES DISPONÍVEIS:"
    echo "   1. ./build-no-vite.sh (recomendado para deploy)"
    echo "   2. Mover vite para dependencies (funciona mas adiciona peso)"
    echo ""
    echo "🚀 EXECUTE: ./build-no-vite.sh && NODE_ENV=production PORT=5013 node dist/server.js"
    
elif grep -q "EADDRINUSE" error-log.txt; then
    echo "❌ PROBLEMA: Porta já está ocupada"
    echo "🔧 SOLUÇÃO: kill -9 \$(lsof -ti:5013)"
    
elif grep -q "Cannot find module" error-log.txt; then
    echo "❌ PROBLEMA: Módulo não encontrado"
    echo "🔧 SOLUÇÃO: npm install"
    
else
    echo "⚠️  ERRO NÃO IDENTIFICADO - veja detalhes acima"
fi

echo ""
echo "📄 Log completo salvo em: error-log.txt"