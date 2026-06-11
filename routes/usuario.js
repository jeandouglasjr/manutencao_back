// src/routes/usuario.js
import express from "express";
const routerUsuario = express.Router();

import {
  listar,
  listarPeloId,
  excluir,
  criar,
  editar,
} from "../controllers/usuario.js";
// 💡 Importe o middleware
import { verificarToken } from "../middleware/auth.js";

// A lista de usuários geralmente precisa de autenticação para ser acessada
routerUsuario.get("/usuario", verificarToken, listar);
routerUsuario.get("/usuario/:id", verificarToken, listarPeloId);
routerUsuario.delete("/usuario/:id", verificarToken, excluir);
// O cadastro pode ser público, mas você pode protegê-lo se for só para admins
routerUsuario.post("/usuario", criar);
routerUsuario.put("/usuario/:id", verificarToken, editar);

export { routerUsuario };
