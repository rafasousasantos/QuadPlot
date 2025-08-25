#!/bin/bash

echo "🚀 DEPLOY FINAL - Complex Function Visualizer"
echo "============================================="
echo "Baseado em apps que funcionaram no EasyPanel"
echo ""

echo "📋 OPÇÕES DE DEPLOY TESTADAS:"
echo ""
echo "1️⃣  DOCKERFILE.PRODUCTION (Recomendado)"
echo "   • Entrypoint inteligente com fallbacks"
echo "   • Build automático com recuperação"
echo "   • Baseado em padrões de sucesso"
echo "   • Health check integrado"
echo ""
echo "2️⃣  DOCKERFILE.NO-VITE (Alternativo)"
echo "   • Sem dependências Vite em produção"
echo "   • Imagem mais leve"
echo "   • Express puro"
echo ""

read -p "Escolha a versão (1 ou 2): " choice

case $choice in
    1)
        echo "✅ DOCKERFILE.PRODUCTION selecionado"
        echo ""
        echo "🏗️  INSTRUÇÕES PARA EASYPANEL:"
        echo "=============================="
        echo "• Dockerfile: Dockerfile.production"
        echo "• Porta: 5013"
        echo "• Environment: NODE_ENV=production, PORT=5013"
        echo "• Health Check: /api/health"
        echo ""
        echo "🔧 COMANDO LOCAL PARA TESTE:"
        echo "docker build -f Dockerfile.production -t complex-visualizer ."
        echo "docker run -p 5013:5013 complex-visualizer"
        echo ""
        echo "📋 CARACTERÍSTICAS:"
        echo "✅ Entrypoint com fallbacks automáticos"
        echo "✅ Detecção automática de problemas Vite"
        echo "✅ Rebuild automático se necessário"
        echo "✅ Health check para EasyPanel"
        echo "✅ Usuário não-root para segurança"
        ;;
    2)
        echo "✅ DOCKERFILE.NO-VITE selecionado"
        echo ""
        echo "🏗️  INSTRUÇÕES PARA EASYPANEL:"
        echo "=============================="
        echo "• Dockerfile: Dockerfile.no-vite"
        echo "• Porta: 5013"
        echo "• Environment: NODE_ENV=production, PORT=5013"
        echo "• Health Check: /api/health"
        echo ""
        echo "🔧 COMANDO LOCAL PARA TESTE:"
        echo "docker build -f Dockerfile.no-vite -t complex-visualizer-clean ."
        echo "docker run -p 5013:5013 complex-visualizer-clean"
        echo ""
        echo "📋 CARACTERÍSTICAS:"
        echo "✅ Zero dependências Vite"
        echo "✅ Express puro e limpo"
        echo "✅ Imagem mais leve"
        echo "✅ Health check para EasyPanel"
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "🎯 APLICAÇÃO COMPLETA INCLUI:"
echo "============================="
echo "✅ Visualização 3D com Plotly.js"
echo "✅ Domain coloring matemático"
echo "✅ Interface React + TypeScript"
echo "✅ Funções quadráticas complexas"
echo "✅ Exemplos educacionais"
echo "✅ Health monitoring"
echo ""
echo "🎓 Baseado em 'Cálculo em uma Variável Complexa' - Marco G. Soares"
echo "🚀 Ready for EasyPanel deployment!"