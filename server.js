require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configurações e Middlewares globais
app.use(cors());
app.use(express.json()); 

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));


// ==========================================
// ROTAS DE FRONTEND (PÁGINAS)
// ==========================================

// Rota principal: Redireciona automaticamente para o login
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Rota para página de login
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Rotas da dashboard
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'dashboard.html'));
});

// Rota de produtos
app.get('/dashboard/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'products.html'));
});

// Rota de edição de produtos
app.get('/dashboard/products/edit/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'edit.html'));
});

// Rota para adicionar produtos
app.get('/dashboard/products/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'add.html'));
});

// Rota para configurações
app.get('/dashboard/settings', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard', 'settings.html'));
});


// ==========================================
// ROTAS DE BACKEND (API)
// ==========================================

// Puxar as rotas presentes em 'api.js' e anexar ao arquivo principal
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes); 


// Iniciar o servidor
app.listen(port, () => {
  console.log(`🚀 Sistema iniciado na porta ${port}`);
});