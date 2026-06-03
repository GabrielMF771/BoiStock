require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const path = require('path')

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')))

// Iniciar a conexão com o banco de dados
const db = require('./db');

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

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


// Puxar as rotas presentes em 'api.js' e anexar ao arquivo principal
const apiRoutes = require('./routes/api');
app.use(express.json()); // Interpretar o item em formato JSON
app.use('/api', apiRoutes); // Caminho das rotas criadas

app.listen(port, () => {
  console.log(`Sistema iniciado na porta ${port}`)
})