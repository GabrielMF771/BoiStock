// Rotas principais de usuário
const express = require('express');

// Modularizar as rotas
const router = express.Router();

// Conectar ao banco
const db = require('../db')

// Funções auxiliares para validar erros
const enviarSucesso = (res, dados, status = 200) => {
    return res.status(status).json({ success: true, data: dados });
};

const enviarErro = (res, mensagem, status = 500) => {
    return res.status(status).json({ success: false, error: mensagem });
};


// CRUD DE PRODUTOS

// Rota para criar um novo produto - POST
router.post('/products', (req, res) => {
    try {
        const { name, description, price, quantity } = req.body;

        // Validação de campos obrigatórios
        if (!name || name.trim() === '' || price === undefined || quantity === undefined) {
            return enviarErro(res, 'Os campos nome, preço e quantidade são obrigatórios.', 400);
        }

        // Validação de regras de negócio (Valores não negativos)
        if (Number(price) < 0 || Number(quantity) < 0) {
            return enviarErro(res, 'Preço e quantidade não podem assumir valores negativos.', 400);
        }

        // Validação de tipos numéricos estruturais
        if (isNaN(price) || isNaN(quantity)) {
            return enviarErro(res, 'Preço e quantidade precisam ser valores numéricos válidos.', 400);
        }

        db.query(
            'INSERT INTO products (name, description, price, quantity) VALUES (?, ?, ?, ?)', 
            [name.trim(), description ? description.trim() : null, Number(price), Number(quantity)], 
            (err, result) => {
                if (err) {
                    console.error('Erro ao criar produto:', err);
                    return enviarErro(res, 'Falha interna ao processar o cadastro no banco de dados.', 500);
                }
                return enviarSucesso(res, { id: result.insertId, message: 'Produto criado com sucesso' }, 201);
            }
        );
    } catch (error) {
        console.error('Exceção capturada no cadastro:', error);
        return enviarErro(res, 'Erro interno no processamento da requisição.', 500);
    }
});

// Rota para listar todos os produtos - GET
router.get('/products', (req, res) => {
    try {
        db.query('SELECT * FROM products', (err, results) => {
            if (err) {
                console.error('Erro ao listar produtos:', err);
                return enviarErro(res, 'Erro ao recuperar listagem de produtos do banco de dados.', 500);
            }
            return enviarSucesso(res, results);
        });
    } catch (error) {
        console.error('Exceção capturada na listagem:', error);
        return enviarErro(res, 'Erro interno no processamento da requisição.', 500);
    }
});

// Buscar um produto específico pelo ID - GET
router.get('/products/:id', (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return enviarErro(res, 'O identificador fornecido na URL deve ser estritamente numérico.', 400);
        }

        db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Erro ao buscar produto:', err);
                return enviarErro(res, 'Erro ao processar consulta do item no banco de dados.', 500);
            }
            
            if (results.length === 0) {
                return enviarErro(res, `Nenhum produto encontrado com o ID ${id}.`, 404);
            }
            
            return enviarSucesso(res, results[0]);
        });
    } catch (error) {
        console.error('Exceção capturada na busca:', error);
        return enviarErro(res, 'Erro interno no processamento da requisição.', 500);
    }
});

// Rota para deletar um produto - DELETE
router.delete('/products/:id', (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return enviarErro(res, 'O identificador fornecido na URL deve ser estritamente numérico.', 400);
        }

        // Validação prévia de existência do recurso antes do comando destrutivo
        db.query('SELECT id FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Erro de validação de ID em deleção:', err);
                return enviarErro(res, 'Erro ao verificar integridade do registro.', 500);
            }

            if (results.length === 0) {
                return enviarErro(res, `Impossível excluir: Produto com ID ${id} não foi localizado.`, 404);
            }

            db.query('DELETE FROM products WHERE id = ?', [id], (deleteErr, result) => {
                if (deleteErr) {
                    console.error('Erro ao deletar produto:', deleteErr);
                    return enviarErro(res, 'Falha ao remover o registro do banco de dados.', 500);
                }
                return enviarSucesso(res, { message: 'Produto removido com sucesso do estoque' });
            });
        });
    } catch (error) {
        console.error('Exceção capturada na remoção:', error);
        return enviarErro(res, 'Erro interno no processamento da requisição.', 500);
    }
});

// Editar um produto - PATCH
router.patch('/products/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity } = req.body;

        if (isNaN(id)) {
            return enviarErro(res, 'O identificador fornecido na URL deve ser estritamente numérico.', 400);
        }

        // Validação prévia de existência do recurso
        db.query('SELECT id FROM products WHERE id = ?', [id], (err, results) => {
            if (err) {
                console.error('Erro de validação de ID:', err);
                return enviarErro(res, 'Erro ao verificar integridade do registro.', 500);
            }

            if (results.length === 0) {
                return enviarErro(res, `Impossível atualizar: Produto com ID ${id} não existe.`, 404);
            }

            const fields = [];
            const values = [];

            // Validações individuais para payload parcial (PATCH)
            if (name !== undefined) {
                if (name.trim() === '') return enviarErro(res, 'O nome do produto não pode ficar em branco.', 400);
                fields.push('name = ?'); 
                values.push(name.trim());
            }
            if (description !== undefined) {
                fields.push('description = ?'); 
                values.push(description ? description.trim() : null);
            }
            if (price !== undefined) {
                if (isNaN(price) || Number(price) < 0) return enviarErro(res, 'Preço inválido ou negativo informado.', 400);
                fields.push('price = ?'); 
                values.push(Number(price));
            }
            if (quantity !== undefined) {
                if (isNaN(quantity) || Number(quantity) < 0) return enviarErro(res, 'Quantidade inválida ou negativa informada.', 400);
                fields.push('quantity = ?'); 
                values.push(Number(quantity));
            }

            if (fields.length === 0) {
                return enviarErro(res, 'Nenhum campo válido foi fornecido para modificação.', 400);
            }

            values.push(id);
            const query = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;

            db.query(query, values, (updateErr, result) => {
                if (updateErr) {
                    console.error('Erro ao atualizar registro:', updateErr);
                    return enviarErro(res, 'Falha ao gravar modificações do produto.', 500);
                }
                return enviarSucesso(res, { message: 'Produto atualizado com sucesso' });
            });
        });
    } catch (error) {
        console.error('Exceção capturada na atualização:', error);
        return enviarErro(res, 'Erro interno no processamento da requisição.', 500);
    }
});

// Exportar o módulo
module.exports = router;