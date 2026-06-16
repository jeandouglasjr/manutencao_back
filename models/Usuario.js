import { DataTypes } from "sequelize";
import { conexao } from "../database.js";
import bcrypt from "bcryptjs";

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
      unique: true, 
    },
    cpf: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
    },
    fone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, 
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
    hooks: {
      beforeCreate: async (usuario) => {
        if (usuario.senha) {
          const salt = await bcrypt.genSalt(10);
          usuario.senha = await bcrypt.hash(usuario.senha, salt);
        }
      },
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
  // Corrigido: Adicionado explicitamente o 'as: "enderecos"' em minúsculo
  Usuario.hasMany(models.Endereco, {
    foreignKey: 'id_usuario',
    as: 'enderecos',
    onDelete: 'CASCADE',
    hooks: true
  });
};

export { Usuario };