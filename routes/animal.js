import express from "express";
const routerAnimal = express.Router();

import {
  listar,
  listarPeloId,
  excluir,
  criar,
  atualizar,
} from "../controllers/animal.js";

routerAnimal.get("/animal", listar);
routerAnimal.get("/animal/:id", listarPeloId);
routerAnimal.delete("/animal/:id", excluir);
routerAnimal.post("/animal", criar);
routerAnimal.put("/animal/:id", atualizar);

export { routerAnimal };
