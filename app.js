import express from "express";
import cors from "cors";

import "dotenv/config";
import { conexao } from "./database.js";
import "./models/index.js";
import { routerUsuario } from "./routes/usuario.js";
import { routerAnimal } from "./routes/animal.js";
import { routerHistoricoAdocao } from "./routes/historico_adocao.js";
import { routerAuth } from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", routerAuth);
app.use("/", routerUsuario);
app.use("/", routerAnimal);
app.use("/", routerHistoricoAdocao);

try {
  await conexao.authenticate();
  await conexao.sync({ alter: true });
  console.log("Banco de dados conectado e sincronizado com sucesso.");
} catch (erro) {
  console.error("Erro ao conectar/sincronizar com o banco:", erro.message);
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`http://localhost:${port}`));
