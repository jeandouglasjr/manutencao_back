import { DataTypes } from "sequelize";
import { conexao } from "../database.js";
import bcrypt from "bcrypt"; // 💡 Importar bcrypt

const Usuario = conexao.define(
  "Usuario",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // 💡 Garante que emails sejam únicos
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // 💡 Garante que CPFs sejam únicos
    },
    fone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // 💡 Garante que FONEs sejam únicos
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    createdAt: "data_cadastro",
    freezeTableName: true,
    updatedAt: true,
    // 💡 HOOK PARA HASH DA SENHA ANTES DE SALVAR
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha) {
          // Gera o hash com custo de 10 (padrão seguro)
          const salt = await bcrypt.genSalt(10);
          usuario.senha = await bcrypt.hash(usuario.senha, salt);
        }
      },
      // Opcional: Hook para atualizar a senha se ela for modificada
      beforeUpdate: async (usuario) => {
        if (usuario.changed("senha") && usuario.senha) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha = await bcrypt.hash(usuario.senha, salt);
        }
      },
    },
  }
);

Usuario.associate = (models) => {
  // Um usuário tem muitos endereços (1..*)
  Usuario.hasMany(models.Endereco, {
  foreignKey: 'id_usuario',
  onDelete: 'CASCADE',
  hooks: true
  });
};

export { Usuario };
