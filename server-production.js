import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Complex Function Visualizer'
  });
});

// Servir arquivos estáticos do frontend
const publicPath = path.join(__dirname, 'public');

if (!fs.existsSync(publicPath)) {
  console.error(`❌ Diretório público não encontrado: ${publicPath}`);
  console.error('Execute o build primeiro: npm run build');
  process.exit(1);
}

// Middleware para arquivos estáticos
app.use(express.static(publicPath));

// Fallback para SPA - todas as rotas retornam index.html
app.get('*', (req, res) => {
  const indexPath = path.join(publicPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Frontend build não encontrado');
  }
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`❌ Erro: ${message}`);
  res.status(status).json({ message });
});

// Iniciar servidor
const port = parseInt(process.env.PORT || '5013', 10);

app.listen(port, '0.0.0.0', () => {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  
  console.log(`${formattedTime} [express] 🚀 Complex Function Visualizer`);
  console.log(`${formattedTime} [express] 📡 Serving on port ${port}`);
  console.log(`${formattedTime} [express] 🌐 Frontend: http://localhost:${port}`);
  console.log(`${formattedTime} [express] ❤️  Health: http://localhost:${port}/api/health`);
});