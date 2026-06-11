// src/routes/auth.js
import express from "express";
const routerAuth = express.Router();

import { login } from "../controllers/auth.js";

// Rota POST para o login
routerAuth.post("/login", login);

export { routerAuth };
