# Dockerfile otimizado especificamente para EasyPanel
FROM node:20-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache libc6-compat curl

# Etapa 1: Instalação de dependências
FROM base AS deps
WORKDIR /app

# Copiar apenas arquivos de dependências primeiro (cache layer)
COPY package.json package-lock.json* ./

# Instalar TODAS as dependências (incluindo devDependencies)
# Isso é crucial para o EasyPanel porque o build precisa de ferramentas como Vite
RUN npm ci --include=dev

# Etapa 2: Build da aplicação
FROM base AS builder
WORKDIR /app

# Copiar dependências da etapa anterior
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Configurar variáveis de ambiente específicas para EasyPanel
ENV NODE_ENV=production
ENV REPL_ID=""
ENV CI=true

# Executar build
RUN npm run build

# Verificar se o build foi bem-sucedido
RUN ls -la dist/ && echo "Build completed successfully"

# Copiar servidor de produção para dist
RUN cp server-production.js dist/server.js

# Etapa 3: Produção
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5013

# Criar usuário não-root para segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar apenas arquivos necessários para produção
COPY --from=builder /app/dist ./dist

# Criar package.json mínimo para produção (apenas express)
RUN echo '{"name":"complex-function-visualizer","version":"1.0.0","dependencies":{"express":"^4.18.0"}}' > package.json

# Instalar apenas express para o servidor
RUN npm install express --production && npm cache clean --force

# Configurar permissões
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 5013

# Health check específico para EasyPanel
HEALTHCHECK --interval=30s --timeout=30s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5013/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))" || exit 1

CMD ["node", "dist/server.js"]