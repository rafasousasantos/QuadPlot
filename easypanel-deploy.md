# Deploy no Easy Panel - Complex Function Visualizer

## 📋 Instruções de Deploy

### 1. Configuração do Projeto no Easy Panel

1. **Criar Novo Projeto**:
   - Nome: `complex-function-visualizer`
   - Tipo: Docker

2. **Configurações do Container**:
   - **Porta**: 5013
   - **Environment Variables**:
     ```
     NODE_ENV=production
     PORT=5013
     ```

3. **Build Settings**:
   - **Dockerfile Path**: `./Dockerfile`
   - **Context**: Root directory

### 2. Opções de Deploy

#### Opção A: Using Docker Build
```bash
# Construir e fazer push da imagem
docker build -t complex-function-visualizer .
docker tag complex-function-visualizer your-registry/complex-function-visualizer:latest
docker push your-registry/complex-function-visualizer:latest
```

#### Opção B: Using Deploy Script
```bash
# Executar script de deploy local
./deploy.sh
```

#### Opção C: Using Docker Compose
```bash
# Deploy com docker-compose
docker-compose up -d
```

### 3. Configuração no Easy Panel

1. **Source Configuration**:
   - Repository URL: `seu-repositorio-git`
   - Branch: `main`
   - Dockerfile: `./Dockerfile`

2. **Port Mapping**:
   - Container Port: `5013`
   - Public Port: `5013` ou porta desejada

3. **Environment Variables** (opcional):
   ```
   NODE_ENV=production
   PORT=5013
   DATABASE_URL=your-database-url (se necessário)
   ```

4. **Resource Limits**:
   - Memory: 512MB - 1GB (recomendado)
   - CPU: 0.5 - 1 CPU core

### 4. Health Check

A aplicação inclui um endpoint de health check:
- **URL**: `/api/health`
- **Método**: GET
- **Response**: `{ "status": "healthy", "timestamp": "...", "service": "Complex Function Visualizer" }`

### 5. Verificação do Deploy

Após o deploy, verifique:
1. **Status**: Container running
2. **Logs**: Sem erros críticos
3. **Health**: `GET /api/health` retorna status 200
4. **Frontend**: Interface carregando corretamente

### 6. URLs de Acesso

- **Aplicação**: `https://seu-dominio:5013`
- **Health Check**: `https://seu-dominio:5013/api/health`

### 7. Troubleshooting

Se houver problemas:

1. **Verificar logs**:
   ```bash
   docker logs complex-function-visualizer
   ```

2. **Verificar porta**:
   - Certifique-se que a porta 5013 está configurada corretamente

3. **Build issues**:
   - Verificar se todas as dependências estão no package.json
   - Verificar se o build script está funcionando localmente

4. **Memory issues**:
   - Aumentar limite de memória do container
   - Otimizar resolução da visualização 3D se necessário