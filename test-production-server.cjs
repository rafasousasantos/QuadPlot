// Test Production Server - Pure CommonJS (no ESM issues)
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5013;

// Middleware básico
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist/public')));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'Complex Function Visualizer - Test'
  });
});

// SPA fallback
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist/public/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Frontend not built' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🔗 Health: http://localhost:${PORT}/api/health`);
});