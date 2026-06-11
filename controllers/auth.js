// src/controllers/auth.js
import { Usuario } from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Assumindo que você tem o SECRET em um arquivo .env
// Lembre-se de adicionar a linha: JWT_SECRET="sua_chave_secreta_aqui" no .env
const JWT_SECRET = process.env.JWT_SECRET || "chave_secreta_padrao";

// Tempo de expiração do token (Ex: 1 hora)
const TOKEN_EXPIRATION = "1h";

/**
 * Função responsável por autenticar o usuário e gerar um JWT.
 */
async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .send({ mensagem: "Email e senha são obrigatórios." });
  }

  try {
    // 1. Buscar o usuário pelo email
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      // Não dê detalhes sobre qual campo está errado (email ou senha)
      return res.status(401).send({ mensagem: "Credenciais inválidas." });
    }

    // 2. Comparar a senha fornecida com o hash no banco
    // O Sequelize armazena a senha em 'usuario.senha'
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).send({ mensagem: "Credenciais inválidas." });
    }

    // 3. Gerar o JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email }, // Payload do token
      JWT_SECRET,
      { expiresIn: TOKEN_EXPIRATION }
    );

    // 4. Sucesso: Retorna o token e os dados básicos do usuário
    return res.status(200).send({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      token: token,
    });
  } catch (err) {
    console.error("Erro no processo de login:", err);
    return res.status(500).send({ mensagem: "Erro interno do servidor." });
  }
}

export { login };
