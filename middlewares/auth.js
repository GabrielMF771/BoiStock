const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Acesso negado. Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Salva o usuário (id, role, isTemp) na requisição
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};

// Middleware para bloquear quem não for gerente
const gerenteMiddleware = (req, res, next) => {
  if (req.user.role !== 'gerente') {
    return res.status(403).json({ error: 'Acesso negado. Apenas gerentes podem realizar esta ação.' });
  }
  next();
};

module.exports = { authMiddleware, gerenteMiddleware };