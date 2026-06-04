// Rotas principais de usuário
const express = require("express");

// Modularizar as rotas
const router = express.Router();

// Prisma client com URL vinda do .env (Docker ou MySQL Workbench)
const { PrismaClient } = require("../generated/prisma");
const prisma = new PrismaClient();

// Funções auxiliares para validar erros
const enviarSucesso = (res, dados, status = 200) => {
  return res.status(status).json({ success: true, data: dados });
};

const enviarErro = (res, mensagem, status = 500) => {
  return res.status(status).json({ success: false, error: mensagem });
};

// CRUD DE PRODUTOS

// Rota para criar um novo produto - POST
router.post("/products", async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    // Validação de campos obrigatórios
    if (
      !name ||
      name.trim() === "" ||
      price === undefined ||
      quantity === undefined
    ) {
      return enviarErro(
        res,
        "Os campos nome, preço e quantidade são obrigatórios.",
        400,
      );
    }

    // Validação de regras de negócio (Valores não negativos)
    if (Number(price) < 0 || Number(quantity) < 0) {
      return enviarErro(
        res,
        "Preço e quantidade não podem assumir valores negativos.",
        400,
      );
    }

    // Validação de tipos numéricos estruturais
    if (isNaN(price) || isNaN(quantity)) {
      return enviarErro(
        res,
        "Preço e quantidade precisam ser valores numéricos válidos.",
        400,
      );
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        price: Number(price),
        quantity: Number(quantity),
      },
    });

    return enviarSucesso(
      res,
      { id: product.id, message: "Produto criado com sucesso" },
      201,
    );
  } catch (error) {
    console.error("Exceção capturada no cadastro:", error);
    return enviarErro(res, "Erro interno no processamento da requisição.", 500);
  }
});

// Rota para listar todos os produtos - GET
router.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return enviarSucesso(res, products);
  } catch (error) {
    console.error("Exceção capturada na listagem:", error);
    return enviarErro(res, "Erro interno no processamento da requisição.", 500);
  }
});

// Buscar um produto específico pelo ID - GET
router.get("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return enviarErro(
        res,
        "O identificador fornecido na URL deve ser estritamente numérico.",
        400,
      );
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      return enviarErro(res, `Nenhum produto encontrado com o ID ${id}.`, 404);
    }

    return enviarSucesso(res, product);
  } catch (error) {
    console.error("Exceção capturada na busca:", error);
    return enviarErro(res, "Erro interno no processamento da requisição.", 500);
  }
});

// Rota para deletar um produto - DELETE
router.delete("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return enviarErro(
        res,
        "O identificador fornecido na URL deve ser estritamente numérico.",
        400,
      );
    }

    await prisma.product.delete({ where: { id } });

    return enviarSucesso(res, {
      message: "Produto removido com sucesso do estoque",
    });
  } catch (error) {
    if (error.code === "P2025") {
      return enviarErro(
        res,
        `Impossível excluir: Produto com ID ${req.params.id} não foi localizado.`,
        404,
      );
    }
    console.error("Exceção capturada na remoção:", error);
    return enviarErro(res, "Erro interno no processamento da requisição.", 500);
  }
});

// Editar um produto - PATCH
router.patch("/products/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, quantity } = req.body;

    if (isNaN(id)) {
      return enviarErro(
        res,
        "O identificador fornecido na URL deve ser estritamente numérico.",
        400,
      );
    }

    const data = {};

    // Validações individuais para payload parcial (PATCH)
    if (name !== undefined) {
      if (name.trim() === "")
        return enviarErro(
          res,
          "O nome do produto não pode ficar em branco.",
          400,
        );
      data.name = name.trim();
    }
    if (description !== undefined) {
      data.description = description ? description.trim() : null;
    }

    if (price !== undefined) {
      if (isNaN(price) || Number(price) < 0)
        return enviarErro(res, "Preço inválido ou negativo informado.", 400);
      data.price = Number(price);
    }

    if (quantity !== undefined) {
      if (isNaN(quantity) || Number(quantity) < 0)
        return enviarErro(
          res,
          "Quantidade inválida ou negativa informada.",
          400,
        );
      data.quantity = Number(quantity);
    }

    if (Object.keys(data).length === 0) {
      return enviarErro(
        res,
        "Nenhum campo válido foi fornecido para modificação.",
        400,
      );
    }

    await prisma.product.update({ where: { id }, data });

    return enviarSucesso(res, { message: "Produto atualizado com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return enviarErro(
        res,
        `Impossível atualizar: Produto com ID ${req.params.id} não existe.`,
        404,
      );
    }
    console.error("Exceção capturada na atualização:", error);
    return enviarErro(res, "Erro interno no processamento da requisição.", 500);
  }
});

// Exportar o módulo
module.exports = router;
