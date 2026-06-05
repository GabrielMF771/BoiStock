const jwt = require('jsonwebtoken')
//verrifica se o usuário tem o token
function verificarToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Acesso negado, faça o login' })
        
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido ou expirado' })

        //salva os dados dos usuários para usar nas proximas funçoes
        req.userId = decoded.id
        rqe.userRole = decoded.role
        next()
    })
}

// verificar se é gerente
funcion apenasGerente(req, res, next) {
    if (req.userRole !== 'gerente') {
        return res.status(403).json({ error: 'Acesso negado para o seu cargo' })
    }
    next()
}

modules.exports = { verificarToken, apenasGerente }
