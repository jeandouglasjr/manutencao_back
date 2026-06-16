import { conexao } from "../database.js"; 
import { Usuario, Endereco } from "../models/index.js"; 

// -----------------------------------------------------------------------
// Funções de Listagem e Exclusão
// -----------------------------------------------------------------------

async function listar(_, res) {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Endereco, as: "enderecos" }],
    });
    return res.status(200).send({ mensagem: usuarios });
  } catch (err) {
    console.log(err);
    res.status(500).send({ mensagem: "Erro interno" });
  }
}

async function listarPeloId(req, res) {
  const { id } = req.params;

  if (isNaN(id) || !id) {
    return res.status(400).send({ mensagem: "ID inválido" });
  }

  try {
    const usuario = await Usuario.findByPk(id, {
      include: [{ model: Endereco, as: "enderecos" }],
    });

    if (!usuario) {
      return res.status(404).send({ mensagem: "Usuário não encontrado." });
    }

    return res.status(200).send({ usuario });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ mensagem: "Erro interno" });
  }
}

async function excluir(req, res) {
  try {
    const { id } = req.params;

    // 1. Apaga primeiro os endereços vinculados para evitar o erro de Chave Estrangeira (FK)
    await Endereco.destroy({ where: { id_usuario: id } });

    // 2. Agora exclui o usuário com segurança
    await Usuario.destroy({ where: { id } });

    return res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).send({ mensagem: "Erro interno" });
  }
}

// -----------------------------------------------------------------------
// Função Criar (Cadastro Aninhado)
// -----------------------------------------------------------------------

async function criar(req, res) {
  try {
    const dadosCompletos = req.body;

    // Validação Mínima de campos obrigatórios
    if (
      !dadosCompletos.nome ||
      !dadosCompletos.email ||
      !dadosCompletos.cpf ||
      !dadosCompletos.fone ||
      !dadosCompletos.senha
    ) {
      return res.status(400).send({
        mensagem: "Campos nome, email, cpf, fone e senha do usuário são obrigatorios.",
      });
    }

    if (!dadosCompletos.enderecos || dadosCompletos.enderecos.length === 0) {
      console.warn("Usuário sendo criado sem endereços.");
    }

    // Corrigido: 'as' alterado para "enderecos" (minúsculo) para bater com a associação
    const usuarioCriado = await Usuario.create(dadosCompletos, {
      include: [
        { model: Endereco, as: "enderecos" }, 
      ],
    });

    return res.status(201).send({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: usuarioCriado,
    });
  } catch (err) {
    console.error("Erro ao cadastrar usuário completo:", err);
    const status = err.name === "SequelizeUniqueConstraintError" ? 409 : 500;
    return res.status(status).send({
      mensagem:
        status === 409
          ? "Email, CPF ou Fone já cadastrados."
          : "Erro interno ao cadastrar usuário completo.",
    });
  }
}

// -----------------------------------------------------------------------
// Função Editar
// -----------------------------------------------------------------------

async function editar(req, res) {
  const { id } = req.params;
  const { nome, email, cpf, fone, senha, enderecos } = req.body;

  const t = await conexao.transaction();

  try {
    // 1. Editar a tabela principal (USUARIO)
    await Usuario.update(
      { nome, email, cpf, fone, senha },
      { where: { id }, transaction: t }
    );

    // 2. Tratar Endereços: Apagar os antigos e criar os novos
    if (enderecos && enderecos.length > 0) {
      await Endereco.destroy({ where: { id_usuario: id }, transaction: t });

      const novosEnderecos = enderecos.map((endereco) => ({
        ...endereco,
        id_usuario: id,
      }));
      await Endereco.bulkCreate(novosEnderecos, { transaction: t });
    }

    await t.commit();

    const usuarioEditado = await Usuario.findByPk(id, {
      include: [{ model: Endereco, as: "enderecos" }],
    });

    return res.status(200).send({
      mensagem: "Usuário e dados relacionados editados com sucesso.",
      usuario: usuarioEditado,
    });
  } catch (err) {
    await t.rollback();
    console.error(err);
    return res
      .status(500)
      .send({ mensagem: "Erro interno ao editar usuário completo." });
  }
}

export { listar, listarPeloId, excluir, criar, editar };