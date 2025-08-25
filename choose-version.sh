#!/bin/bash

echo "🚀 COMPLEX FUNCTION VISUALIZER - DEPLOY OPTIONS"
echo "================================================"

echo "Escolha a versão para deploy:"
echo ""
echo "1️⃣  VERSÃO COM VITE (dependencies)"
echo "   • Usa Dockerfile original"
echo "   • Vite nas dependencies normais"
echo "   • Mais compatível com ambiente Replit"
echo ""
echo "2️⃣  VERSÃO SEM VITE (production)"
echo "   • Usa Dockerfile.no-vite"
echo "   • Express puro sem dependências do Vite"
echo "   • Menor imagem Docker"
echo ""

read -p "Escolha (1 ou 2): " choice

case $choice in
    1)
        echo "✅ VERSÃO COM VITE selecionada"
        echo ""
        echo "📦 Para build local:"
        echo "   npm run build"
        echo "   NODE_ENV=production PORT=5013 node dist/index.js"
        echo ""
        echo "🐳 Para Docker:"
        echo "   docker build -t complex-function-visualizer ."
        echo "   docker run -p 5013:5013 complex-function-visualizer"
        echo ""
        echo "📋 Usar Dockerfile padrão no Easy Panel"
        ;;
    2)
        echo "✅ VERSÃO SEM VITE selecionada"
        echo ""
        echo "📦 Para build local:"
        echo "   ./build-no-vite.sh"
        echo "   NODE_ENV=production PORT=5013 node dist/server.js"
        echo ""
        echo "🐳 Para Docker:"
        echo "   docker build -f Dockerfile.no-vite -t complex-function-visualizer-no-vite ."
        echo "   docker run -p 5013:5013 complex-function-visualizer-no-vite"
        echo ""
        echo "📋 Usar Dockerfile.no-vite no Easy Panel"
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "🎯 Ambas as versões incluem:"
echo "   ✅ Visualização 3D com Plotly.js"
echo "   ✅ Domain coloring matemático"  
echo "   ✅ Interface completa React + TypeScript"
echo "   ✅ Health check em /api/health"
echo "   ✅ Porta 5013 configurada"