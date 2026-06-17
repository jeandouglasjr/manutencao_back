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

// Rotas principais
app.use("/", routerAuth);
app.use("/", routerUsuario);
app.use("/", routerAnimal);
app.use("/", routerHistoricoAdocao);

// Rota raiz de teste para você verificar se a API está viva pelo navegador
app.get("/", (req, res) => {
  res.json({ status: "online", mensagem: "Backend de Manutenção de Animais Ativo!" });
});

// Autenticação do banco de dados (Sem derrubar a aplicação na nuvem)
conexao.authenticate()
  .then(() => {
    console.log("🚀 Banco de dados conectado com sucesso.");
    
    // Executa a sincronização apenas em desenvolvimento para não travar a Vercel
    if (process.env.NODE_ENV !== "production") {
      conexao.sync({ alter: true })
        .then(() => console.log("Sincronização de tabelas concluída."))
        .catch(err => console.error("Erro na sincronização:", err.message));
    }
  })
  .catch((erro) => {
    console.error("❌ Erro ao conectar com o banco:", erro.message);
    // Não usamos process.exit(1) aqui na Vercel para a função não morrer
  });

const PORT = process.env.PORT || 3000;

// O app.listen SÓ deve ser executado localmente
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor rodando localmente na porta ${PORT}`);
  });
}

// Exportação obrigatória para as Serverless Functions da Vercel
export default app;