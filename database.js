import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

if (!process.env.BANCO_DE_DADOS) {
  console.error("❌ ERRO: A variável de ambiente BANCO_DE_DADOS não foi definida!");
}

// Criando a instância com o nome 'conexao' exigido pelos seus modelos e app.js
const conexao = new Sequelize(process.env.BANCO_DE_DADOS, {
  dialect: "postgres",
  logging: false, // Evita logs excessivos no painel da Vercel
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Obrigatório para o Supabase/AWS na Vercel
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Teste de conexão imediato
try {
  await conexao.authenticate();
  console.log("🚀 Conexão com o Supabase estabelecida com sucesso!");
} catch (error) {
  console.error("❌ Não foi possível conectar ao banco de dados:", error.message);
}

// Exportando exatamente o nome que os seus arquivos estão procurando
export { conexao };