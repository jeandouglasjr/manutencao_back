// src/middleware/auth.js
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_padrao";

/**
 * Middleware para verificar a autenticação (JWT) em rotas protegidas.
 */
async function verificarToken(req, res, next) {
  // Pega o header 'Authorization'
  const authHeader = req.headers["authorization"];

  // Espera-se o formato: "Bearer <token>"
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // 401 Unauthorized (Não autenticado)
    return res
      .status(401)
      .send({ mensagem: "Acesso negado. Token não fornecido." });
  }

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Adiciona os dados do usuário ao objeto da requisição
    req.usuarioId = decoded.id;
    req.usuarioEmail = decoded.email;

    // Prossegue para a próxima função (controller)
    next();
  } catch (err) {
    // Se o token for inválido ou expirado
    // 403 Forbidden (Não autorizado/Token inválido)
    return res.status(403).send({ mensagem: "Token inválido ou expirado." });
  }
}

export { verificarToken };
