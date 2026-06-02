// Rotas principais de usuário
const express = require('express');

// Modularizar as rotas
const router = express.Router();

// Conectar ao banco
const db = require('../db')

// CRUD DE PRODUTOS

// Rota para criar um novo produto - POST
router.post('/products', (req, res) => {
    const { name, description, price, quantity } = req.body;
    db.query('INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)', [name, description, price, quantity], (err, result) => {
        if (err) {
            console.error('Erro ao criar produto:', err);
            res.status(500).json({ error: 'Erro ao criar produto' });
        } else {
            res.status(201).json({ message: 'Produto criado com sucesso', id: result.insertId });
        }
    });
});

// Rota para listar todos os produtos - GET
router.get('/products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) {
            console.error('Erro ao listar produtos:', err);
            res.status(500).json({ error: 'Erro ao listar produtos' });
        } else {
            res.json(results);
        }
    });
});

// Rota para deletar um produto - DELETE
router.delete('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM products WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar produto:', err);
            res.status(500).json({ error: 'Erro ao deletar produto' });
        } else {
            res.json({ message: 'Produto deletado com sucesso' });
        }
    });
});

// Buscar um produto específico pelo ID - GET
router.get('/products/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produto:', err);
            res.status(500).json({ error: 'Erro ao buscar produto' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Produto não encontrado' });
        } else {
            res.json(results[0]); // Retorna apenas o produto em vez de uma lista
        }
    });
});

// Editar um produto - PATCH
router.patch('/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    const fields = [];
    const values = [];

    if (name) { fields.push('name = ?'); values.push(name); }
    if (description) { fields.push('description = ?'); values.push(description); }
    if (price) { fields.push('price = ?'); values.push(price); }
    if (quantity) { fields.push('quantity = ?'); values.push(quantity); }

    if (fields.length === 0) {
        return res.status(400).json({ error: 'Nenhum campo informado' });
    }

    values.push(id);
    const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar:', err);
            res.status(500).json({ error: 'Erro ao atualizar' });
        } else {
            res.json({ message: 'Produto atualizado com sucesso' });
        }
    });
});

// Exportar o módulo
module.exports = router;