import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.BANCO_DE_DADOS) {
  console.error("❌ ERRO: A variável de ambiente BANCO_DE_DADOS não foi definida!");
}

const sequelize = new Sequelize(process.env.BANCO_DE_DADOS, {
  dialect: "postgres",
  logging: false, // Evita logs excessivos no painel da Vercel
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Permite certificados autoassinados da AWS/Supabase
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Teste de conexão opcional ao iniciar o módulo
try {
  await sequelize.authenticate();
  console.log("🚀 Conexão com o Supabase estabelecida com sucesso!");
} catch (error) {
  console.error("❌ Não foi possível conectar ao banco de dados:", error);
}

export default sequelize;