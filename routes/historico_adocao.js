// routes/historicoAdocao.js

import express from "express";
const routerHistoricoAdocao = express.Router();

import {
  listarHistorico,
  criarHistorico,
  listarHistoricoPeloId,
  atualizarHistorico,
  excluirHistorico,
  // Adicione as outras funções aqui
} from "../controllers/historico_Adocao.js";

// Rotas:
routerHistoricoAdocao.get("/historico_adocao", listarHistorico);
routerHistoricoAdocao.post("/historico_adocao", criarHistorico);
routerHistoricoAdocao.get("/historico_adocao/:id", listarHistoricoPeloId);
routerHistoricoAdocao.put("/historico_adocao/:id", atualizarHistorico);
routerHistoricoAdocao.delete("/historico_adocao/:id", excluirHistorico);

export { routerHistoricoAdocao };
