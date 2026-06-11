import { Animal } from "../models/Animal.js";

async function listar(_, res) {
  try {
    const animal = await Animal.findAll();
    return res.status(200).send({ mensagem: animal });
  } catch (err) {
    console.log(err);
    res.status(500).send({ mensagem: "Erro interno" });
  }
}

async function listarPeloId(req, res) {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).send({ mensagem: "ID inválido" });
  }
  try {
    // Buscar dado pela chave primaria (primary key ou pk)
    const animal = await Animal.findByPk(id);
    res.status(200).send({ animal });
  } catch (err) {
    console.log(err);
    res.status(500).send({ mensagem: "Erro interno" });
  }
}

async function excluir(req, res) {
  try {
    const { id } = req.params;
    // DELETE = destroy
    await Animal.destroy({ where: { id } });
    res.status(204).send({ mensagem: "Animal excluido com sucesso" });
  } catch (err) {
    console.log(err);
    res.status(500).send({ mensagem: "Erro interno" });
  }
}

// CRIAR DADOS = create
async function criar(req, res) {
  try {
    const { nome, especie, raca, sexo, nascimento, porte, saude, status, data_resgate } =
      req.body;
    if (
      !nome ||
      !especie ||
      !raca ||
      !sexo ||
      !nascimento ||
      !porte ||
      !saude ||
      !status
    ) {
      return res
        .status(400)
        .send({ mensagem: "Todos os campos são obrigatórios!" });
    }
    const animalCriado = await Animal.create({
      nome,
      especie,
      raca,
      sexo,
      nascimento,
      porte,
      saude,
      status,
      data_resgate,
    });
    res.status(201).send({ Mensagem: `Animal cadastrado` });
  } catch (err) {
    console.log(err);
    res.status(500).send({ Mensagem: "Erro ao cadastrar animal" });
  }
}

// ATUALIZAR DADOS = update
async function atualizar(req, res) {
  try {
    const { nome, especie, raca, sexo, nascimento, porte, saude, status, data_resgate } =
      req.body;
    const { id } = req.params;
    if (
      !id ||
      !nome ||
      !especie ||
      !raca ||
      !sexo ||
      !nascimento ||
      !porte ||
      !saude ||
      !status
    ) {
      return res.status(400).send({
        mensagem: "Todos os campos são obrigatorios!",
      });
    }
    const animalAtualizado = await Animal.update(
      { nome, especie, raca, sexo, nascimento, porte, saude, status, data_resgate },
      { where: { id } }
    );
    res.status(200).send({ Mensagem: `Animal atualizado`});
  } catch (err) {
    console.log(err);
    res.status(500).send({ Mensagem: "Erro ao atualizar animal" });
  }
}

export { listar, listarPeloId, excluir, criar, atualizar };
