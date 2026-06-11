import { Animal } from "./Animal.js";
import { Endereco } from "./Endereco.js";
import { Historico_Adocao } from "./Historico_Adocao.js";
import { Perfil } from "./Perfil.js";
import { Usuario } from "./Usuario.js";
import { Usuario_Perfil } from "./Usuario_Perfil.js";

const models = {
  Animal,
  Endereco,
  Historico_Adocao,
  Perfil,
  Usuario,
  Usuario_Perfil,
};

Object.values(models)
  .filter((model) => typeof model.associate === "function")
  .forEach((model) => model.associate(models));

export { Animal, Endereco, Historico_Adocao, Perfil, Usuario, Usuario_Perfil, models };
