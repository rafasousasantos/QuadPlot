// Production Server - Pure CommonJS para EasyPanel
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware para debug
app.use((req, res, next) => {
  const start = Date.now();
  const requestPath = req.path;
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (requestPath.startsWith("/api")) {
      const formattedTime = new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      console.log(`${formattedTime} [express] ${req.method} ${requestPath} ${res.statusCode} in ${duration}ms`);
    }
  });
  
  next();
});

// Health check endpoint - obrigatório para EasyPanel
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Complex Function Visualizer',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Endpoint de informações do sistema
app.get('/api/info', (req, res) => {
  res.json({
    name: 'Complex Function Visualizer',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    port: process.env.PORT || 5013,
    timestamp: new Date().toISOString()
  });
});

// Servir arquivos estáticos do frontend
const publicPath = path.join(__dirname, 'public');

// Verificar se o build existe
if (!fs.existsSync(publicPath)) {
  console.error(`❌ Diretório público não encontrado: ${publicPath}`);
  console.error('Certifique-se de que o build foi executado corretamente');
  console.error('Estrutura esperada: dist/public/index.html');
  
  // Para debug, listar arquivos na pasta dist
  const distPath = path.join(__dirname);
  if (fs.existsSync(distPath)) {
    console.log('📁 Arquivos em dist:');
    fs.readdirSync(distPath).forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  process.exit(1);
}

// Middleware para servir arquivos estáticos
app.use(express.static(publicPath, {
  maxAge: '1d', // Cache por 1 dia
  etag: true
}));

// Fallback para SPA - todas as rotas não-API retornam index.html
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: 'Frontend build não encontrado',
      path: indexPath,
      exists: false
    });
  }
});

// Error handler global
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`❌ Erro ${status}: ${message}`);
  console.error(err.stack);
  
  res.status(status).json({ 
    error: message,
    timestamp: new Date().toISOString()
  });
});

// Configuração do servidor
const port = parseInt(process.env.PORT || '5013', 10);
const host = '0.0.0.0'; // Importante para Docker/EasyPanel

// Iniciar servidor
app.listen(port, host, () => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  
  console.log(`${formattedTime} [express] 🚀 Complex Function Visualizer`);
  console.log(`${formattedTime} [express] 📡 Servidor rodando na porta ${port}`);
  console.log(`${formattedTime} [express] 🌐 Frontend: http://localhost:${port}`);
  console.log(`${formattedTime} [express] ❤️  Health: http://localhost:${port}/api/health`);
  console.log(`${formattedTime} [express] ℹ️  Info: http://localhost:${port}/api/info`);
  console.log(`${formattedTime} [express] 📁 Servindo arquivos de: ${publicPath}`);
  
  // Verificar se index.html existe
  const indexPath = path.join(publicPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log(`${formattedTime} [express] ✅ Frontend build encontrado`);
  } else {
    console.log(`${formattedTime} [express] ⚠️  Frontend build não encontrado`);
  }
});