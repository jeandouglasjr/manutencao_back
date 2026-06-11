import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.BANCO_DE_DADOS) {
  throw new Error("Variavel BANCO_DE_DADOS nao foi definida no arquivo .env");
}

const conexao = new Sequelize(process.env.BANCO_DE_DADOS, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export { conexao };
