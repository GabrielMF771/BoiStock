// Rotas principais de usuário
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

// ============================================================================
// MIDDLEWARES DE SEGURANÇA (OS "PORTEIROS")
// ============================================================================

// 1. Verifica se o usuário enviou uma pulseira (Token) válida
const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return enviarErro(res, "Acesso negado. Você precisa fazer login.", 401);
  }

  jwt.verify(token, process.env.JWT_SECRET || "segredo_padrao_temporario", (err, decoded) => {
    if (err) {
      return enviarErro(res, "Sessão expirada ou token inválido. Faça login novamente.", 403);
    }
    
    // Salvamos os dados na requisição para usar nas rotas
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next(); 
  });
};

// 2. Verifica se a pessoa que passou pelo primeiro porteiro é um Gerente
const apenasGerente = (req, res, next) => {
  if (req.userRole !== "gerente") {
    return enviarErro(res, "Acesso bloqueado: Apenas gerentes podem realizar esta ação.", 403);
  }
  next(); 
};

// ============================================================================
// ROTAS DE AUTENTICAÇÃO E USUÁRIOS
// ============================================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return enviarErro(res, "E-mail e senha são obrigatórios.", 400);
    }

    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return enviarErro(res, "Usuário ou senha incorretos.", 401);
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return enviarErro(res, "Usuário ou senha incorretos.", 401);
    }

    // Gera o Token JWT contendo o ID, ROLE e status da senha temporária
    const token = jwt.sign(
      { id: user.id, role: user.role, isTempPassword: user.isTempPassword }, 
      process.env.JWT_SECRET || "segredo_padrao_temporario", 
      { expiresIn: "8h" }
    );

    return res.json({ 
      success: true, 
      message: "Login realizado com sucesso",
      token: token,
      role: user.role,
      name: user.name,
      isTempPassword: user.isTempPassword // Avisa o front se precisa trocar a senha
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return enviarErro(res, "Erro interno no servidor.", 500);
  }
});

// Troca de Senha Obrigatória
router.post('/change-password', verificarToken, async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword || newPassword.trim() === "") {
      return enviarErro(res, "A nova senha não pode estar em branco.", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword, isTempPassword: false }
    });

    return enviarSucesso(res, { message: 'Senha atualizada com sucesso. Faça login novamente.' });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    return enviarErro(res, "Erro ao alterar a senha.", 500);
  }
});

// Gerente cria novo usuário
router.post('/users', verificarToken, apenasGerente, async (req, res) => {
  try {
    const { name, email, tempPassword, role } = req.body;
    
    if (!name || !email || !tempPassword) {
      return enviarErro(res, "Nome, e-mail e senha temporária são obrigatórios.", 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return enviarErro(res, "Este e-mail já está cadastrado no sistema.", 400);
    }

    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        role: role || 'operador',
        isTempPassword: true // Força a troca no primeiro login
      }
    });

    return enviarSucesso(res, { message: 'Usuário cadastrado com sucesso!' }, 201);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    return enviarErro(res, "Erro ao cadastrar novo funcionário.", 500);
  }
});

// ============================================================================
// CRUD DE PRODUTOS
// ============================================================================

// Rota para criar um novo produto - POST (APENAS GERENTE)
router.post("/products", verificarToken, apenasGerente, async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    if (!name || name.trim() === "" || price === undefined || quantity === undefined) {
      return enviarErro(res, "Os campos nome, preço e quantidade são obrigatórios.", 400);
    }

    if (Number(price) < 0 || Number(quantity) < 0) {
      return enviarErro(res, "Preço e quantidade não podem assumir valores negativos.", 400);
    }

    if (isNaN(price) || isNaN(quantity)) {
      return enviarErro(res, "Preço e quantidade precisam ser valores numéricos válidos.", 400);
    }

    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description ? description.trim() : null,
        price: Number(price),
        quantity: Number(quantity),
      },
    });

    return enviarSucesso(res, { id: product.id, message: "Produto criado com sucesso" }, 201);
  } catch (error) {
    console.error("Exceção capturada no cadastro:", error);
    return enviarErro(res, "Erro interno no processamento da requisição.", 500);
  }
});

// Rota para listar todos os produtos - GET (GERENTE E OPERADOR)
router.get("/products", verificarToken, async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return enviarSucesso(res, products);
  } catch (error) {
    console.error("Exceção capturada na listagem:", error);
    return enviarErro(res, "Erro interno no processamento da requisição.", 500);
  }
});

// Buscar um produto específico pelo ID - GET (GERENTE E OPERADOR)
router.get("/products/:id", verificarToken, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return enviarErro(res, "O identificador fornecido na URL deve ser estritamente numérico.", 400);
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

// Editar um produto - PATCH (GERENTE E OPERADOR, mas com restrições)
router.patch("/products/:id", verificarToken, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, quantity } = req.body;

    if (isNaN(id)) {
      return enviarErro(res, "O identificador fornecido na URL deve ser estritamente numérico.", 400);
    }

    // REGRA DE NEGÓCIO: Se for operador, bloqueia alteração de nome, descrição ou preço
    if (req.userRole === 'operador') {
      if (name !== undefined || description !== undefined || price !== undefined) {
        return enviarErro(res, "Acesso negado: Operadores podem alterar apenas a quantidade em estoque.", 403);
      }
    }

    const data = {};

    if (name !== undefined) {
      if (name.trim() === "") return enviarErro(res, "O nome do produto não pode ficar em branco.", 400);
      data.name = name.trim();
    }
    
    if (description !== undefined) {
      data.description = description ? description.trim() : null;
    }

    if (price !== undefined) {
      if (isNaN(price) || Number(price) < 0) return enviarErro(res, "Preço inválido ou negativo informado.", 400);
      data.price = Number(price);
    }

    if (quantity !== undefined) {
      if (isNaN(quantity) || Number(quantity) < 0) return enviarErro(res, "Quantidade inválida ou negativa informada.", 400);
      data.quantity = Number(quantity);
    }

    if (Object.keys(data).length === 0) {
      return enviarErro(res, "Nenhum campo válido foi fornecido para modificação.", 400);
    }

    await prisma.product.update({ where: { id }, data });

    return enviarSucesso(res, { message: "Produto atualizado com sucesso" });
  } catch (error) {
    if (error.code === "P2025") {
      return enviarErro(res, `Impossível atualizar: Produto com ID ${req.params.id} não existe.`, 404);
    }
    console.error("Exceção capturada na atualização:", error);
    return enviarErro(res, "Erro interno no processamento da requisição.", 500);
  }
});

// Rota para deletar um produto - DELETE (APENAS GERENTE)
router.delete("/products/:id", verificarToken, apenasGerente, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return enviarErro(res, "O identificador fornecido na URL deve ser estritamente numérico.", 400);
    }

    await prisma.product.delete({ where: { id } });

    return enviarSucesso(res, { message: "Produto removido com sucesso do estoque" });
  } catch (error) {
    if (error.code === "P2025") {
      return enviarErro(res, `Impossível excluir: Produto com ID ${req.params.id} não foi localizado.`, 404);
    }
    console.error("Exceção capturada na remoção:", error);
    return enviarErro(res, "Erro interno no processamento da requisição.", 500);
  }
});

// Exportar o módulo
module.exports = router;