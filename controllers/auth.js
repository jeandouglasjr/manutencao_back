import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js"; // Ajuste o caminho se seu modelo estiver em outro lugar

const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_padrao";

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    // 1. Busca o usuário pelo e-mail
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
    }

    // 2. Compara a senha usando o bcryptjs
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ mensagem: "E-mail ou senha inválidos." });
    }

    // 3. Gera o Token JWT válido por 24 horas
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // 4. Retorna os dados de sucesso
    return res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (error) {
    console.error("Erro no controller de autenticação:", error);
    return res.status(500).json({ mensagem: "Erro interno no servidor." });
  }
}

export { login };