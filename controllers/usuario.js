import { conexao } from "../database.js"; // IMPORTANTE: Sua instância Sequelize
import { Usuario, Endereco } from "../models/index.js"; // Assumindo que você tem um index.js para exportar os modelos

// -----------------------------------------------------------------------
// Funções de Listagem e Exclusão (Mantidas)
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
    await Usuario.destroy({ where: { id } });
    // Corrigido para retornar 200/204, sem body na 204
    return res.status(204).send();
  } catch (err) {
    console.log(err);
    res.status(500).send({ mensagem: "Erro interno" });
  }
}

// -----------------------------------------------------------------------
// Função Criar (Cadastro Aninhado) - Implementada no NovoUsuario.jsx
// -----------------------------------------------------------------------

// CRIAR DADOS = create (com inclusão aninhada)
async function criar(req, res) {
  try {
    // A requisição agora contém todos os dados aninhados: Usuario e Enderecos

    const dadosCompletos = req.body;

    // 🚨 Validação Mínima de campos obrigatórios:
    if (
      !dadosCompletos.nome ||
      !dadosCompletos.email ||
      !dadosCompletos.cpf ||
      !dadosCompletos.fone ||
      !dadosCompletos.senha
    ) {
      return res.status(400).send({
        mensagem:
          "Campos nome, email, cpf, fone e senha do usuário são obrigatorios.",
      });
    }

    // 💡 Opção de validação para garantir que ao menos 1 endereço exista
    if (!dadosCompletos.enderecos || dadosCompletos.enderecos.length === 0) {
      console.warn(
        "Usuário sendo criado sem endereços. Isso pode ser permitido, mas é bom alertar."
      );
    }

    // Use a opção 'include' para criar os dados aninhados
    const usuarioCriado = await Usuario.create(dadosCompletos, {
      include: [
        { model: Endereco, as: "enderecos" }, // 'enderecos' deve corresponder ao 'as' da associação
      ],
    });

    // 201 Created é a resposta correta para criação de recurso
    return res.status(201).send({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: usuarioCriado,
    });
  } catch (err) {
    console.error("Erro ao cadastrar usuário completo:", err);
    // Em caso de erro de validação (ex: email duplicado), Sequelize pode retornar um erro específico
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
// Função Editar (Mantida)
// -----------------------------------------------------------------------

// EDITAR DADOS = update (Com tratamento de associações)
async function editar(req, res) {
  const { id } = req.params;
  // Captura todos os dados, incluindo os arrays enderecos
  const { nome, email, cpf, fone, senha, enderecos } = req.body;

  // Inicia a transação. Se algo der errado, tudo é desfeito.
  const t = await conexao.transaction();

  try {
    // 1. Editar a tabela principal (USUARIO)
    await Usuario.update(
      { nome, email, cpf, fone, senha },
      { where: { id }, transaction: t }
    );

    // 2. Tratar Endereços: Apagar os antigos e criar os novos (Estratégia de Sincronização Simples)
    if (enderecos && enderecos.length > 0) {
      // Remove todos os endereços antigos deste usuário
      await Endereco.destroy({ where: { id_usuario: id }, transaction: t });

      // Mapeia e cria os novos endereços com a FK do usuário
      const novosEnderecos = enderecos.map((endereco) => ({
        ...endereco,
        id_usuario: id,
      }));
      await Endereco.bulkCreate(novosEnderecos, { transaction: t });
    }

    // 3. Confirma a transação (salva tudo no banco)
    await t.commit();

    // 5. Busca o registro editado (com as associações) para retornar na resposta
    const usuarioEditado = await Usuario.findByPk(id, {
      include: [{ model: Endereco, as: "enderecos" }],
    });

    return res.status(200).send({
      mensagem: "Usuário e dados relacionados editados com sucesso.",
      usuario: usuarioEditado,
    });
  } catch (err) {
    // Em caso de erro, desfaz todas as operações do banco
    await t.rollback();
    console.error(err);
    return res
      .status(500)
      .send({ mensagem: "Erro interno ao editar usuário completo." });
  }
}

// -----------------------------------------------------------------------
// Exportação
// -----------------------------------------------------------------------

export { listar, listarPeloId, excluir, criar, editar };
