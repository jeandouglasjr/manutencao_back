import { Historico_Adocao } from "../models/Historico_Adocao.js";
// Você pode precisar importar outros modelos se quiser fazer 'includes'
import { Usuario } from "../models/Usuario.js";
import { Animal } from "../models/Animal.js";

// Função para listar todos os registros
async function listarHistorico(_, res) {
  try {
    // Exemplo de como usar include para trazer dados de outras tabelas
    const historicos = await Historico_Adocao.findAll({
      include: [{ model: Usuario, as: 'adotante' }, { model: Animal, as: 'animal_adotado' }]
    });
    return res.status(200).send({ historicos });
  } catch (err) {
    console.error(err);
    res.status(500).send({ mensagem: "Erro interno ao listar histórico" });
  }
}

// Função para criar um novo registro
async function criarHistorico(req, res) {
  try {
    const { data_adocao, observacao, id_usuario, id_animal } = req.body;

    // Validação básica (adapte conforme necessário)
    if (!data_adocao || !id_usuario || !id_animal) {
      return res
        .status(400)
        .send({ mensagem: "Campos obrigatórios ausentes!" });
    }

    const novoRegistro = await Historico_Adocao.create({
      data_adocao,
      observacao: observacao || "N/A",
      id_usuario,
      id_animal,
    });

    // Atualizar o status do animal para 'Adotado'
    await Animal.update({ status: "Adotado" }, { where: { id: id_animal } });

    res.status(201).send({
      mensagem: "Registro de Adoção criado com sucesso",
      registro: novoRegistro,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ mensagem: "Erro interno ao criar registro" });
  }
}

async function listarHistoricoPeloId(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).send({ mensagem: "ID inválido" });
    }

    const historico = await Historico_Adocao.findByPk(id);

    if (!historico) {
      return res
        .status(404)
        .send({ mensagem: "Registro de Histórico não encontrado" });
    }

    res.status(200).send({ historico });
  } catch (err) {
    console.error(err);
    res.status(500).send({ mensagem: "Erro interno ao buscar registro" });
  }
}

async function atualizarHistorico(req, res) {
  try {
    const { id } = req.params;
    const dadosParaAtualizar = req.body; // Pega todos os campos enviados no body

    if (isNaN(id)) {
      return res.status(400).send({ mensagem: "ID inválido" });
    }

    // Atualiza o registro baseado no ID. O `dadosParaAtualizar` contém os campos que serão alterados.
    const [linhasAfetadas, registrosAtualizados] =
      await Historico_Adocao.update(dadosParaAtualizar, {
        where: { id },
        returning: true, // Retorna os registros atualizados (útil no PostgreSQL, ignorado por MySQL/SQLite)
      });

    if (linhasAfetadas === 0) {
      return res
        .status(404)
        .send({
          mensagem: "Registro de Histórico não encontrado para atualização",
        });
    }

    // Para MySQL/SQLite, você pode buscar o registro atualizado separadamente
    const historicoAtualizado = await Historico_Adocao.findByPk(id);

    res.status(200).send({
      mensagem: "Registro de Histórico atualizado com sucesso",
      registro: historicoAtualizado,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ mensagem: "Erro interno ao atualizar registro" });
  }
}

async function excluirHistorico(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(id)) {
      return res.status(400).send({ mensagem: "ID inválido" });
    }

    // Primeiro buscamos o registro para saber qual animal era
    const historico = await Historico_Adocao.findByPk(id);

    if (!historico) {
      return res
        .status(404)
        .send({
          mensagem: "Registro de Histórico não encontrado para exclusão",
        });
    }

    // Atualiza o status do animal de volta para 'Disponível' ao excluir a adoção
    await Animal.update({ status: "Disponível" }, { where: { id: historico.id_animal } });

    // Exclui o registro baseado no ID.
    await Historico_Adocao.destroy({
      where: { id },
    });

    res.status(200).send({ mensagem: "Registro de Histórico excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ mensagem: "Erro interno ao excluir registro" });
  }
}

export {
  listarHistorico,
  listarHistoricoPeloId,
  excluirHistorico,
  criarHistorico,
  atualizarHistorico,
};
// Adicione as outras funções aqui
