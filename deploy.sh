#!/bin/bash

# Script de implementação para Easy Panel
# Porta: 5013

set -e

echo "🚀 Iniciando deploy da aplicação Complex Function Visualizer..."

# Verificar se o Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instale o Docker primeiro."
    exit 1
fi

# Definir variáveis
IMAGE_NAME="complex-function-visualizer"
CONTAINER_NAME="cfv-app"
PORT=5013

echo "📦 Construindo imagem Docker..."
docker build -t $IMAGE_NAME .

echo "🛑 Parando container existente (se houver)..."
docker stop $CONTAINER_NAME 2>/dev/null || true
docker rm $CONTAINER_NAME 2>/dev/null || true

echo "🏃 Executando novo container..."
docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:$PORT \
  -e NODE_ENV=production \
  -e PORT=$PORT \
  $IMAGE_NAME

echo "⏳ Aguardando aplicação inicializar..."
sleep 5

# Verificar se o container está rodando
if docker ps | grep -q $CONTAINER_NAME; then
    echo "✅ Container em execução!"
    echo "🌐 Aplicação disponível em: http://localhost:$PORT"
    echo "📊 Logs do container: docker logs $CONTAINER_NAME"
    echo "🔄 Status: docker ps | grep $CONTAINER_NAME"
else
    echo "❌ Erro: Container não está executando"
    echo "📝 Logs do container:"
    docker logs $CONTAINER_NAME
    exit 1
fi

echo ""
echo "🎯 Deploy concluído com sucesso!"
echo "📋 Comandos úteis:"
echo "   • Logs:     docker logs -f $CONTAINER_NAME"
echo "   • Parar:    docker stop $CONTAINER_NAME"
echo "   • Remover:  docker rm $CONTAINER_NAME"
echo "   • Status:   docker ps | grep $CONTAINER_NAME"