const jwt = require('jsonwebtoken')

//verrifica se o usuário tem o token
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Acesso negado, faça o login' })
    

jwt.verify(token.split(" ")[1], process.env.JWT_SECRET || 'secret123', (err, decoded) => {
        if (err) return res.status(401).send({ message: "Não autorizado!" });

        
        //salva os dados dos usuários para usar nas proximas funçoes
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.mustChangePassword = decoded.mustChangePassword;
        next();
    });
}

// verificar se é gerente
function isManager(req, res, next) {
    if (req.userRole === 'manager') {
        next();
    } else {
        res.status(403).send({ message: "Requer privilégios de Gerente!" });
    }
}

module.exports = { verifyToken, isManager };
