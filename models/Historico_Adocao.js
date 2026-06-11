import { DataTypes } from "sequelize";
import { conexao } from "../database.js";
// 🚨 ASSOCIAÇÕES: Importe os modelos relacionados
import { Animal } from "./Animal.js"; // Supondo que o arquivo seja './Animal.js'
import { Usuario } from "./Usuario.js"; // Supondo que o arquivo seja './Usuario.js'

// conexao.define('Nome da tabela', { objeto com as colunas da tabela e seus tipos })
const Historico_Adocao = conexao.define(
    "Historico_Adocao",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        data_adocao: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        observacao: {
            type: DataTypes.STRING,
            allowNull: true
        },
        // A definição da chave estrangeira está correta no modelo
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Usuario", // Nome da tabela
                key: "id",
            },
        },
        // A definição da chave estrangeira está correta no modelo
        id_animal: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Animal", // Nome da tabela
                key: "id",
            },
        },
    },
    {
        createdAt: "data_cadastro", // Criar coluna de criação com o nome 'data_cadastro'
        freezeTableName: true,
        updatedAt: true,
    }
);

// ----------------------------------------------------
// 🤝 DEFINIÇÃO DAS ASSOCIAÇÕES
// ----------------------------------------------------

// O Historico_Adocao pertence a um Usuario (Adotante)
Historico_Adocao.belongsTo(Usuario, {
    foreignKey: "id_usuario",
    as: "adotante", // Alias opcional para facilitar o include (e.g., include: {model: Usuario, as: 'adotante'})
});

// O Historico_Adocao pertence a um Animal (Adotado)
Historico_Adocao.belongsTo(Animal, {
    foreignKey: "id_animal",
    as: "animal_adotado", // Alias opcional para facilitar o include
});


// ℹ️ NOTA IMPORTANTE:
// Você também deve adicionar as associações nos modelos Usuario e Animal
// para ter a relação bidirecional (exemplo abaixo, fora deste arquivo):
//
// Usuario.hasMany(Historico_Adocao, { foreignKey: 'id_usuario', as: 'historico_adocoes' });
// Animal.hasOne(Historico_Adocao, { foreignKey: 'id_animal', as: 'adocao_recente' });


export { Historico_Adocao };