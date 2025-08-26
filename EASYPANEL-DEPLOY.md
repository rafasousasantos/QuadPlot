# EasyPanel Deployment Guide
# Complex Function Visualizer

## 🎯 Solução Implementada

Baseado no guia completo fornecido, implementamos a **Solução 1 (Dockerfile Otimizado)** com melhorias para garantir compatibilidade total com EasyPanel.

### ✅ Problemas Resolvidos

1. **ERR_MODULE_NOT_FOUND: Cannot find package 'vite'** - Eliminado usando servidor CommonJS
2. **Dependências de desenvolvimento em produção** - Dockerfile multi-stage separa build e produção
3. **Imports ESM problemáticos** - Servidor usa CommonJS puro (.cjs)
4. **Plugins Replit conflitantes** - Config de produção desabilitada com `REPL_ID=""`

## 📁 Arquivos Criados

### 1. Dockerfile Principal: `Dockerfile.easypanel`
- Build multi-stage otimizado
- Instala todas dependências para build
- Produção usa apenas CommonJS
- Health check incluído

### 2. Servidor de Produção: `server-production.cjs`
- Pure CommonJS (sem problemas ESM)
- Health check obrigatório para EasyPanel
- Logs detalhados para debug
- Serving de arquivos estáticos otimizado

### 3. Config Vite Produção: `vite.config.production.ts`
- Sem plugins problemáticos do Replit
- Aliases corretos mantidos
- Build otimizado para produção

### 4. Build Script: `build-easypanel.sh`
- Build e validação automática
- Testes de health check
- Verificações de segurança

## 🚀 Deploy no EasyPanel

### Passo 1: Configurar Variáveis de Ambiente

No painel do EasyPanel, configure:

```env
NODE_ENV=production
PORT=5013
REPL_ID=""
```

### Passo 2: Dockerfile

Use: `Dockerfile.easypanel`

### Passo 3: Build Commands

- **Build Command**: Automático (Docker build)
- **Start Command**: Automático (`CMD` no Dockerfile)

### Passo 4: Health Check

EasyPanel detectará automaticamente: `/api/health`

## 🧪 Validação Local

Execute o build script para testar:

```bash
./build-easypanel.sh
```

### Resultado Esperado:
```
✅ BUILD SUCCESSFUL!
📁 Frontend: dist/public/index.html
🚀 Server: dist/server.cjs
🐳 Dockerfile: Dockerfile.easypanel
```

## 🔧 Teste Manual do Docker

```bash
# Build da imagem
docker build -f Dockerfile.easypanel -t complex-visualizer .

# Run container
docker run -p 5013:5013 complex-visualizer

# Teste endpoints
curl http://localhost:5013/api/health
curl http://localhost:5013/api/info
```

## 📊 Estrutura de Deploy

```
projeto/
├── Dockerfile.easypanel       # 👈 USE ESTE
├── server-production.cjs      # Servidor CommonJS
├── vite.config.production.ts  # Config sem plugins problemáticos  
├── build-easypanel.sh         # Script de build e teste
└── dist/                      # Gerado pelo build
    ├── public/                # Frontend assets
    │   ├── index.html
    │   └── assets/
    └── server.cjs             # Servidor de produção
```

## 🐛 Troubleshooting

### Problema: "require is not defined"
**Solução**: O servidor usa .cjs extension (CommonJS puro)

### Problema: "Cannot find package 'vite'"
**Solução**: Dockerfile instala dependências corretamente e produção não usa Vite

### Problema: Health check failing
**Verificar**:
- Porta 5013 exposta
- Endpoint `/api/health` respondendo
- Variável PORT configurada

### Problema: Frontend não carrega
**Verificar**:
- Build frontend executou: `dist/public/index.html` existe
- Assets estão em `dist/public/assets/`
- Servidor serve arquivos estáticos corretamente

## 📋 Checklist de Deploy

- [ ] Dockerfile.easypanel configurado
- [ ] Variáveis de ambiente definidas no EasyPanel
- [ ] Repository conectado ao EasyPanel
- [ ] Build script testado localmente
- [ ] Health check endpoint funcionando
- [ ] Frontend assets sendo servidos

## 🎉 Endpoints Disponíveis Após Deploy

- **Frontend**: `https://seu-app.easypanel.app/`
- **Health Check**: `https://seu-app.easypanel.app/api/health`
- **Info**: `https://seu-app.easypanel.app/api/info`

## 🔒 Segurança

- Usuário não-root no container
- Dependências mínimas em produção
- Cache otimizado
- Logs estruturados

---

## 💡 Por Que Esta Solução Funciona

1. **Multi-stage Docker**: Separa build (com devDependencies) de produção
2. **CommonJS Server**: Evita problemas de ESM/require em produção
3. **Vite Config Simples**: Remove plugins que causam problemas
4. **Health Check**: EasyPanel precisa para confirmar deploy funcionando
5. **Verificações Automáticas**: Build script valida tudo antes do deploy

Esta é uma solução robusta e testada que resolve os problemas de deploy identificados no guia.